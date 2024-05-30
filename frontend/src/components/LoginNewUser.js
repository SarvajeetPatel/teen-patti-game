import React from 'react'

function LoginNewUser({ newUser, setNewUser, logNewUser }) {
    return (
        <div className="card w-100 text-center border-white">
            <div className="row">
                <div className="col-12">
                    <h3> Enter UserName </h3>
                </div>
                <div className="d-flex justify-content-center py-1">
                    <div className="col-4">
                        <input
                            type="text"
                            name="username"
                            value={newUser}
                            className="form-control mb-3"
                            placeholder="UserName"
                            autoComplete="off"
                            onChange={(e) => setNewUser(e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' ? logNewUser() : null}
                        />
                        <button
                            className="btn btn-success w-50"
                            type="button"
                            onClick={() => logNewUser()}
                        >
                            JOIN! </button>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default LoginNewUser