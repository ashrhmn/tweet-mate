import service from "@/service";
import { endpoints } from "api-interface";
import { GetServerSideProps } from "next";
import { useRouter } from "next/router";
import { useState } from "react";
import { toast } from "react-hot-toast";

export const getServerSideProps: GetServerSideProps = async (context) =>
    service(
        endpoints.auth.currentUser,
        context,
    )({})
        .then(() => ({
            props: {},
            redirect: { destination: "/", statusCode: 301 },
        }))
        .catch(() => ({ props: {} }));

const SignUp = () => {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");

    const router = useRouter();

    const handleSignUp = () => {
        toast
            .promise(
                service(endpoints.auth.signup)({
                    body: { password, username, confirmPassword },
                }),
                {
                    error: "Error Signing Up",
                    loading: "Signing Up...",
                    success: "Success",
                },
            )
            .then(() => router.push("/"))
            .catch(() => { });
    };

    return (
        <div className="flex flex-col gap-4 items-center justify-center">
            <input
                className="text-xl p-2 rounded border-2 border-neutral-600"
                value={username}
                placeholder="Username"
                onChange={(e) => setUsername(e.target.value)}
            />
            <input
                type="password"
                className="text-xl p-2 rounded border-2 border-neutral-600"
                value={password}
                placeholder="Password"
                onChange={(e) => setPassword(e.target.value)}
            />
            <input
                type="password"
                className="text-xl p-2 rounded border-2 border-neutral-600"
                value={confirmPassword}
                placeholder="Confirm Password"
                onChange={(e) => setConfirmPassword(e.target.value)}
            />
            <div>
                <button
                    onClick={handleSignUp}
                    className="bg-blue-500 p-2 rounded text-white"
                >
                    Sign Up
                </button>
            </div>
        </div>
    );
};

export default SignUp;
