
import {Outlet} from "react-router-dom";
import Header from "../components/Header/Header.jsx";


const Layout = () => {
    return(
        <div className="site-wrapper">
            <Header/>
            <main>
                <Outlet/>
            </main>
        </div>
    )
}

export default Layout