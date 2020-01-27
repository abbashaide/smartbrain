import React from 'react';
import './ImageLinkForm.css';

const ImageLinkForm = ({onInputChange, onPictureSubmit}) => {
	return(
		<div>
			<p className= 'f3'>
				{'I am capable of detecting faces in your pictures. They call me SMART BRAINS!'}
			</p>
			<div className='center'>
				<div className='center form pa4 br3 shadow-5'>
					<input className='f4 pa2 w-70 center' type="text" onChange={onInputChange}/>
					<button onClick={onPictureSubmit} className='w-30 grow f4 link ph3 pv2 dib myButton'>Detect</button>
				</div>
			</div>
	  </div>
	);
}

export default ImageLinkForm;