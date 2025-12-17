import { useState } from "react"
import supabase from '@/lib/supabaseClient'
import moment from "moment"
import Swal from "sweetalert2"

import { checkPasscode } from '@/services/authService'

import { Card, TextInput, HelperText, Button } from "flowbite-react"
import { FaEye, FaEyeSlash } from "react-icons/fa"

const cardTheme = {
    root: {
        base: "w-full rounded-xl border-none",
        children: "p-4",
    }
};

export default function Page({ setPage }) {
    const [password, setPassword] = useState('');
    const [isPasswordVisible, setIsPasswordVisible] = useState(false);

    const handleChangePassword = (e) => setPassword(e.target.value);
    const handleClickShowHidePassword = () => setIsPasswordVisible(!isPasswordVisible);

    const setSessionLocalStorage = () => {
        const currentDate = moment().format('YYYY-MM-DD HH:mm:ss');
        localStorage.setItem('session_data', currentDate);
    }

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!password.length) {
            Swal.fire({ icon: 'error', text: 'Masukkan kode keamanan terlebih dahulu!' });
            return;
        }

        Swal.fire({
            title: 'Proses...',
            text: 'Silakan tunggu',
            showConfirmButton: false,
            allowOutsideClick: false,
            allowEscapeKey: false,
            didOpen: () => { Swal.showLoading(); }
        });

        try {
            // Cek passcode dan dapatkan UUID
            const passcodeData = await checkPasscode(password);
            if (!passcodeData) {
                Swal.close();
                Swal.fire({ icon: 'error', text: 'Kode yang Anda masukkan salah!' });
                return;
            }

            // Login ke Supabase menggunakan Anonymous Auth
            const { data: authData, error: authError } = await supabase.auth.signInAnonymously({
                options: {
                    data: {
                        user_id: passcodeData.user_id || passcodeData.id
                    }
                }
            });

            if (authError) {
                console.error('Supabase auth error:', authError);
                Swal.close();
                Swal.fire({ icon: 'error', text: 'Gagal autentikasi dengan server!' });
                return;
            }

            // Simpan user_id dari passcode ke localStorage untuk backup
            localStorage.setItem('user_id', passcodeData.user_id || passcodeData.id);

            Swal.close();
            Swal.fire({
                icon: 'success',
                html: '<h3>Kode Valid</h3><small>Sedang mengalihkan ke halaman dashboard...</small>',
                showConfirmButton: false,
                allowOutsideClick: false,
                allowEscapeKey: false,
                timerProgressBar: true,
                timer: 1500
            }).then(() => {
                setSessionLocalStorage();
                setPage('calendar');
            });
        } catch (error) {
            console.error('Error fetching data:', error);
            Swal.close();
            Swal.fire({ icon: 'error', text: 'Terjadi kesalahan pada sistem!' });
        }
    };

    return (
        <div className='w-full h-screen flex justify-center items-center bg-gray-100 dark:bg-gray-700'>
            <div className="w-1/4">
                <Card theme={cardTheme}>
                    <form onSubmit={(e) => handleSubmit(e)}>
                        <h3 className='text-2xl font-bold text-black dark:text-white mb-5'>Akses Keamanan</h3>
                        <div>
                            <div className="relative">
                                <div
                                    className="absolute inset-y-0 end-3 top-0 flex items-center pe-3.5 cursor-pointer z-10 text-black dark:text-white"
                                    onClick={handleClickShowHidePassword}
                                >
                                    {isPasswordVisible ? <FaEye size={20} /> : <FaEyeSlash size={20} />}
                                </div>
                                <TextInput
                                    type={isPasswordVisible ? "text" : "password"}
                                    placeholder="Masukkan Kode Keamanan"
                                    value={password}
                                    onChange={(e) => handleChangePassword(e)}
                                />
                            </div>
                            <HelperText>Masukkan kode keamanan untuk membuka halaman</HelperText>
                        </div>
                        <Button
                            className="bg-primary hover:bg-primary-dark mt-3 w-full"
                            onClick={(e) => handleSubmit(e)}
                        >
                            Submit
                        </Button>
                    </form>
                </Card>
            </div>
        </div>
    )
}