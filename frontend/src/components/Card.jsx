import "../blocks/card.css";

export default function Card({image, title, children}){
    return (
        <article className="card">
            {image && <img className="card-image" src={image} alt="" />}
            <h3>{title}</h3>
            <p>{children}</p>
        </article>
    );
}

