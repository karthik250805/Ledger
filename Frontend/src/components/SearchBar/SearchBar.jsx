import "./SearchBar.css";
import { FiSearch } from "react-icons/fi";

export default function SearchBar({ searchTerm, setSearchTerm }) {

    return (

        <div className="search-box">

            <FiSearch className="search-icon"/>

            <input

                type="text"

                placeholder="Search customer by name or phone..."

                value={searchTerm}

                onChange={(e)=>setSearchTerm(e.target.value)}

            />

        </div>

    );

}