import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';
import UploadImages from './components/upload-images.component';

function App() {
  return (
    <div className="container" style={{ width: '600px' }}>
      <div className="my-2">
        <h4>Gallery</h4>
      </div>
      <br />
      <UploadImages />
    </div>
  );
}

export default App;
