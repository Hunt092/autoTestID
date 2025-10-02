function UserTable({ users, onEdit, onDelete, onView }) {
	const [sortField, setSortField] = useState("name");
	const [sortDirection, setSortDirection] = useState("asc");
	const [filter, setFilter] = useState("");

	return (
		<div className="table-container">
			<div className="table-header">
				<h2>Users</h2>
				<div className="table-controls">
					<input
						type="text"
						placeholder="Filter users..."
						value={filter}
						onChange={(e) => setFilter(e.target.value)}
					/>
					<select
						value={sortField}
						onChange={(e) => setSortField(e.target.value)}
					>
						<option value="name">Name</option>
						<option value="email">Email</option>
						<option value="role">Role</option>
					</select>
					<button
						onClick={() =>
							setSortDirection(sortDirection === "asc" ? "desc" : "asc")
						}
					>
						{sortDirection === "asc" ? "↑" : "↓"}
					</button>
				</div>
			</div>

			<table className="data-table">
				<thead>
					<tr>
						<th>Name</th>
						<th>Email</th>
						<th>Role</th>
						<th>Actions</th>
					</tr>
				</thead>
				<tbody>
					{users.map((user) => (
						<tr key={user.id}>
							<td>{user.name}</td>
							<td>{user.email}</td>
							<td>{user.role}</td>
							<td>
								<button onClick={() => onEdit(user)} className="btn-edit">
									Edit
								</button>
								<button
									onClick={() => onDelete(user.id)}
									className="btn-delete"
								>
									Delete
								</button>
								<button onClick={() => onView(user)} className="btn-view">
									View
								</button>
							</td>
						</tr>
					))}
				</tbody>
			</table>

			<div className="table-footer">
				<div className="pagination">
					<button disabled={currentPage === 1}>Previous</button>
					<span>
						Page {currentPage} of {totalPages}
					</span>
					<button disabled={currentPage === totalPages}>Next</button>
				</div>
			</div>
		</div>
	);
}
