import React from 'react'

const Footer = () => {
  return (
    <footer className="d-flex flex-wrap justify-content-between align-items-center py-3 my-4 border-top">
            <div className="col-md-4 d-flex align-items-center">
                <a href="/" className="mb-3 me-2 mb-md-0 text-muted text-decoration-none lh-1">
                    <svg className="bi" width="30" height="24"><use xlinkHref="#bootstrap"></use></svg>
                </a>
                <span className="mb-3 mb-md-0 text-muted">© Bert Veraele</span>
            </div>

            <ul className="nav col-md-4 justify-content-end list-unstyled d-flex m-4">
                <li className="ms-3"><a className="text-muted" href="https://github.com/bvervaele" target="_blank" rel="noopener noreferrer"><img className="rounded-circle" src="https://github.githubassets.com/assets/GitHub-Mark-ea2971cee799.png" alt="Github" width="40" height="40" /></a></li>
            </ul>
        </footer>
  )
}

export default Footer