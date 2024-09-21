import React from 'react'
import ReactDOM from 'react-dom/client'
import Main from './Main.jsx'
import UpdatesPopup from './smallScripts/UpdatesPopup.jsx';

// removed <React.StrictMode></React.StrictMode>
ReactDOM.createRoot(document.getElementById('root')).render(
	<>
		<Main />
    {false && <UpdatesPopup />}
  </>
)
