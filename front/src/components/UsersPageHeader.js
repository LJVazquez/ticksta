export default function UsersPageHeader(props) {
	const { searchValue, setSearchValue, selectValue, setSelectValue } = props;

	return (
		<div className="row mb-5 justify-content-between align-items-center">
			<div className="col-12 col-md-auto text-center text-md-start mb-3 mb-md-0">
				<h1 className="fw-bold mx-2">
					<i className="bi bi-person-fill text-info"></i> Usuarios
				</h1>
			</div>
			<div className="col-12 col-md-auto row mx-0">
				<div className="col-12 col-md-auto">
					<div className="input-group input-group-sm mb-3 mb-md-0">
						<span className="input-group-text bg-dark-subtle border-0 text-white">
							<i className="bi bi-search"></i>
						</span>
						<input
							id="searchInput"
							placeholder="Buscar"
							className="form-control border border-dark-subtle"
							value={searchValue}
							onChange={(e) => setSearchValue(e.target.value)}
						/>
					</div>
				</div>
				<div className="col-12 col-md-auto">
					<div className="input-group input-group-sm">
						<select
							id="statusInput"
							className="form-select border border-dark-subtle"
							value={selectValue}
							onChange={(e) => setSelectValue(e.target.value)}
						>
							<option value="ALL">Todos</option>
							<option value="ADMIN">Admin</option>
							<option value="MANAGER">Manager</option>
							<option value="USER">User</option>
							<option value="DEV">Desarrollador</option>
						</select>
						<span className="input-group-text bg-dark-subtle border-0 text-white">
							<i className="bi bi-card-checklist"></i>
						</span>
					</div>
				</div>
			</div>
		</div>
	);
}
