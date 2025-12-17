import { useEffect } from "react"
import Swal from "sweetalert2"

const Loader = () => {
    useEffect(() => {
        Swal.fire({
            title: "Loading...",
            text: "Mohon tunggu",
            allowOutsideClick: false,
            allowEscapeKey: false,
            didOpen: () => {
                Swal.showLoading();
            },
        });

        return () => {
            Swal.close();
        };
    }, []);

    return null;
};

export default Loader