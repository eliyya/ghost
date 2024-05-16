import Image from "next/image";

export default function login() {
    return (
        <div className="flex justify-center items-center h-screen">
            <form
                className="w-72 p-4 border border-black rounded-lg flex flex-col"
                action=""
                method="post"
            >
                <input
                    className="mb-2 p-2 border border-black rounded-md"
                    type="text"
                    name="name"
                    id="name"
                    placeholder="Enter your name"
                />
                <input
                    className="mb-2 p-2 border border-black rounded-md"
                    type="text"
                    name="email"
                    id="email"
                    placeholder="Enter your email"
                />
                <input
                    className="mb-2 p-2 border border-black rounded-md"
                    type="text"
                    name="phone"
                    id="phone"
                    placeholder="Enter your phone"
                />
                <input
                    className="bg-black text-white p-2 rounded-md cursor-pointer hover:bg-gray-900"
                    type="submit"
                    value="Submit"
                />
            </form>
            <div className="absolute">
                <Image src="/img/unnamed.jpg" alt="" width={100} height={100} />
            </div>
        </div>
    );
}
