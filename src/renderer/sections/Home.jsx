
export default function Home() {
    return (
        <section className="flex-1 bg-gradient-to-t from-primary-300  to-transparent h-full">
            <div className="flex h-full">
                {/* Form and Icon */}
                <div className="h-full w-full flex flex-col justify-center items-center">
                    <h1 className="relative text-[8rem]">W-G</h1>
                    <form>
                        <input className="bg-white border rounded-2xl border-slate-900 text-black p-2" />
                    </form>
                </div>
            </div>
        </section>
    );
}