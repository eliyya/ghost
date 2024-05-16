interface PageProps {
    slug: string;
}

export default async function Page(props: PageProps) {
    return (
        <div>
            <h1>Lab: {props.slug}</h1>
        </div>
    )
}