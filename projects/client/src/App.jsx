import React from 'react';
import { Route, Routes } from 'react-router-dom';
import routes from './routes/routes';
import L from 'leaflet';

import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';

let DefaultIcon = L.icon({
    iconUrl: icon,
    shadowUrl: iconShadow
});

L.Marker.prototype.options.icon = DefaultIcon;

function App() {
    return (
        <Routes>
            {routes.map((val, key) => {
                return (
                    <Route exact path={val.path} element={val.element} key={key} />
                );
            })}
        </Routes>
    );
}

export default App;
