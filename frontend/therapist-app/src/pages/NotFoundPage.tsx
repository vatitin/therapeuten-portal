import { Link } from 'react-router-dom';

function NotFoundPage() {
  return (
    <div>
      <h1>Seite nicht gefunden</h1>
      <h3>
        Link zur Homepage: <Link to="/">Home Page</Link>
      </h3>
    </div>
  );
}

export { NotFoundPage };
