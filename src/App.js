import React, { Component } from 'react';

import styled from 'styled-components';
import GlobalStyle from './GlobalStyle';
import FileList from './components/FileList';
import FilenameModifier from './components/FilenameModifier';
import FileDrop from './components/FileDrop';
import FileFormat from './components/FileFormat';
import Execution from './components/Execution';
import Preview from './components/Preview';

const { ipcRenderer } = window.require('electron');

const Wrapper = styled.div`
  margin: 5vh;
`;

const InnerWrapper = styled.div`
  height: 90vh;
  display: grid;
  grid-template-columns: repeat(10, auto);
  grid-template-rows: repeat(10, auto);
`;


class App extends Component {
  constructor() {
    super();

    this.state = {
      files: [],
      selectedFile: {},
      selectedFormat: '',
      saveToCurrentDirectory: true,
    }
  }

  componentDidMount() {
    ipcRenderer.on('onFetchMetaDataComplete', (event, files) => this.setState({ files: [...this.state.files, ...files] }));
  }

  // Dropzone
  addFiles = (files) => {
    const paths = this.state.files.map(file => file.path);
    const filtered = files.filter(file => !paths.includes(file.path));

    ipcRenderer.send('onFilesAdded', filtered);
  }

  // File list
  removeFiles = (files) => {
    const toRemove = files.map(file => file.path);
    this.setState({ files: this.state.files.filter(file => !toRemove.includes(file.path)) });
  }

  // Preview
  setSelectedFile = (selectedFile) => {
    this.setState({ selectedFile: selectedFile });
  }

  // File format
  selectFormat = (format) => {
    this.setState({ selectedFormat: format });
  }

  // Execution
  setSaveToCurrentDirectory = (enabled) => {
    this.setState({ saveToCurrentDirectory: enabled });
  }

  // Execution
  convertFiles = (files) => {
    if (files.length > 0)
      ipcRenderer.send('onFilesConvertStart', files,
        { saveLocation: document.getElementById('inputPath').value, saveToCurrentDirectory: this.state.saveToCurrentDirectory },
        { prefix: document.getElementById('inputPrefix').value, suffix: document.getElementById('inputSuffix').value });
  }

  render() {
    return (
      <Wrapper>
        <GlobalStyle />
        <InnerWrapper>
          <FileList files={this.state.files} removeFiles={this.removeFiles} setSelectedFile={this.setSelectedFile} />
          <FilenameModifier />
          <FileDrop addFiles={this.addFiles} />
          <Preview selectedFile={this.state.selectedFile} /> {/**convert video before passing */}
          <FileFormat selectFormat={this.selectFormat} />
          <Execution convert={() => this.convertFiles(this.state.files)} saveToCurrentDirectory={this.state.saveToCurrentDirectory} setSaveToCurrentDirectory={this.setSaveToCurrentDirectory} />
        </InnerWrapper>
      </Wrapper>
    );
  }
}

export default App;
