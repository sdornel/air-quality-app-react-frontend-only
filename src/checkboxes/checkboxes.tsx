import './checkboxes.css';
import React from 'react';

const Checkboxes = (props: any) => (
    <div className="filter-checkboxes-div" data-testid="filter-checkboxes-div">
        <nav id="filter-group" className="filter-group">
        <input onChange={props.toggleVisibility} title="community-button" name="community" type="checkbox" id="poi-theatre" defaultChecked></input>
        <label htmlFor='poi-theatre'>Community</label>
        <input onChange={props.toggleVisibility} title="research-button" name="research" type="checkbox" id="poi-rocket" defaultChecked></input>
        <label htmlFor='poi-rocket'>Research</label>
        <input onChange={props.toggleVisibility} title="government-button" name="government" type="checkbox" id="poi-museum" defaultChecked></input>
        <label htmlFor='poi-museum'>Government</label>
        </nav>
    </div>
);

export default Checkboxes;
