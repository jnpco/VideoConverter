import React from 'react';
import _Dropzone from 'react-dropzone';

import styled from 'styled-components';

const Wrapper = styled.div`
  background-color:bisque;
  min-width: 50vh;
  min-height: 30vh;
  grid-column: 1/6;
  grid-row: 8/11;
`;

const Dropzone = styled(_Dropzone)`
  width: 100%;
  height: 100%;
  display: flex;
  text-align:center;
  align-items:center;
  justify-content: center;
  border: 2px dashed gray;
  border-radius: 5px;
`;

const FileDrop = ({ addFiles }) => {
  const handleOnDrop = (acceptedFiles) => {
    addFiles(acceptedFiles.map(file =>
      ({ id: file.path, name: file.name, path: file.path, meta: {}, type: file.type, progress: 0, complete: false, outputPath: '' })
    ));
  }

  // TODO Accept other video formats
  return (
    <Wrapper>
      <Dropzone onDrop={handleOnDrop} multiple={true} accept={'video/*'}>
        {
          ({ isDragActive, isDragAccept, isDragReject }) => {
            return (
              <div>
                {/* // TODO: Return a different component for each. */}
                <p>Drag 'n' drop some files here, or click to select files.</p>
              </div>
            );
          }
        }
      </Dropzone>
    </Wrapper>
  );
}

export default FileDrop;