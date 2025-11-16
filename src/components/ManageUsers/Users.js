import { useEffect, useState } from "react";
import { fetchAllUser, deleteUser } from "../../services/userService";
import ReactPaginate from "react-paginate";
import { toast } from "react-toastify";
import ModalDelete from "./ModalDelete";
import ModalUser from "./ModalUser";

const Users = () => {
    const [listUsers, setListUsers] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [currentLimit, setCurrentLimit] = useState(3);
    const [totalPages, setTotalPages] = useState(0);
    const [isShowModalDelete, setIsShowModalDelete] = useState(false);
    const [dataModal, setDataModal] = useState({});
    const [isShowModalUser, setIsShowModalUser] = useState(false);
    const [actionModalUser, setActionModalUser] = useState("CREATE");
    const [dataModalUser, setDataModalUser] = useState({});

    useEffect(() => {
        fetchUsers();
    }, [currentPage]);

    const fetchUsers = async () => {
        try {
            let response = await fetchAllUser(currentPage, currentLimit);
            if (response?.EC === 0) {
                setTotalPages(response.DT.totalPages || 0);
                setListUsers(response.DT.users || []);
            } else {
                toast.error(response?.EM || "Failed to fetch users");
            }
        } catch (err) {
            toast.error("Server error");
        }
    };

    const handlePageClick = (event) => {
        setCurrentPage(event.selected + 1);
    };

    const handleDeleteUser = (user) => {
        setDataModal(user);
        setIsShowModalDelete(true);
    };

    const handleCloseDelete = () => {
        setIsShowModalDelete(false);
        setDataModal({});
    };

    const confirmDeleteUser = async () => {
        try {
            let response = await deleteUser(dataModal);
            if (response?.EC === 0) {
                toast.success(response.EM);
                await fetchUsers();
                setIsShowModalDelete(false);
            } else {
                toast.error(response.EM || "Delete failed");
            }
        } catch (err) {
            toast.error("Server error");
        }
    };

    const handleCloseModalUser = async () => {
        setIsShowModalUser(false);
        setActionModalUser("CREATE");
        setDataModalUser({});
        await fetchUsers();
    };

    const handleEditUser = (user) => {
        setActionModalUser("UPDATE");
        setDataModalUser(user);
        setIsShowModalUser(true);
    };

    const handleAddUser = () => {
        setActionModalUser("CREATE");
        setDataModalUser({});
        setIsShowModalUser(true);
    };

    const handleRefresh = async () => {
        setCurrentPage(1);
        await fetchUsers();
    };

    return (
        <div className="container">
            <div className="manage-users-container">
                <div className="user-header">
                    <div className="title mt-3">
                        <h3>Manage Users</h3>
                    </div>
                    <div className="actions my-3">
                        <button className="btn btn-success refresh" onClick={handleRefresh}>
                            <i className="fa fa-refresh"></i> Refresh
                        </button>
                        <button className="btn btn-primary" onClick={handleAddUser}>
                            <i className="fa fa-plus-circle"></i> Add new user
                        </button>
                    </div>
                </div>
                <div className="user-body">
                    <table className="table table-hover table-bordered">
                        <thead>
                            <tr>
                                <th>No</th>
                                <th>Id</th>
                                <th>Email</th>
                                <th>Username</th>
                                <th>Group</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {listUsers.length > 0 ? (
                                listUsers.map((item, index) => (
                                    <tr key={`row-${index}`}>
                                        <td>{(currentPage - 1) * currentLimit + index + 1}</td>
                                        <td>{item.id}</td>
                                        <td>{item.email}</td>
                                        <td>{item.username}</td>
                                        <td>{item.Group?.name || "N/A"}</td>
                                        <td>
                                            <span
                                                title="Edit"
                                                className="edit mx-3"
                                                onClick={() => handleEditUser(item)}
                                            >
                                                <i className="fa fa-pencil"></i>
                                            </span>
                                            <span
                                                title="Delete"
                                                className="delete"
                                                onClick={() => handleDeleteUser(item)}
                                            >
                                                <i className="fa fa-trash-o"></i>
                                            </span>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan={6}>Not found users</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
                {totalPages > 0 && (
                    <div className="user-footer">
                        <ReactPaginate
                            nextLabel="next >"
                            onPageChange={handlePageClick}
                            pageRangeDisplayed={3}
                            marginPagesDisplayed={2}
                            pageCount={totalPages}
                            previousLabel="< previous"
                            pageClassName="page-item"
                            pageLinkClassName="page-link"
                            previousClassName="page-item"
                            previousLinkClassName="page-link"
                            nextClassName="page-item"
                            nextLinkClassName="page-link"
                            breakLabel="..."
                            breakClassName="page-item"
                            breakLinkClassName="page-link"
                            containerClassName="pagination"
                            activeClassName="active"
                            renderOnZeroPageCount={null}
                        />
                    </div>
                )}
            </div>

            <ModalDelete
                show={isShowModalDelete}
                handleClose={handleCloseDelete}
                confirmDeleteUser={confirmDeleteUser}
                dataModal={dataModal}
            />
            <ModalUser
                onHide={handleCloseModalUser}
                show={isShowModalUser}
                action={actionModalUser}
                dataModalUser={dataModalUser}
            />
        </div>
    );
};

export default Users;