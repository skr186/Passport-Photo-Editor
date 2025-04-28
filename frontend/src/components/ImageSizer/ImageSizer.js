import React, { Component } from "react";
import "./ImageSizer.scss";

import AvatarEditor from "react-avatar-editor";
import RangeInput from "../RangeInput/RangeInput";
import personOverlay from "./person-overlay.svg";

import { partial } from "lodash";
import { MdAddCircleOutline, MdRemoveCircleOutline } from "react-icons/md";

export default class ImageSizer extends Component {
  constructor(props) {
    super(props);
    this.state = {
      scale: 1,
      gridMode: false,
      selectedCountry: "Canada", // Add state for selected country
      sizes: this.getDimensionsForCountry("Canada"), // Set initial sizes
    };
    this.changeScale = this.changeScale.bind(this);
    this.handleCountryChange = this.handleCountryChange.bind(this);
  }

  render() {
    const { sourceImage } = this.props;
    const { sizes, scale, gridMode, selectedCountry } = this.state;
    if (!sourceImage) return null;
    return (
      <div className="image-sizer-container">
        <h2>Passport Photo Editor</h2>
        <p>Zoom and crop your photo below:</p>
        <div className="country-selector">
          <label htmlFor="country">Select Country:</label>
          <select
            id="country"
            value={selectedCountry}
            onChange={this.handleCountryChange}
            className="country-dropdown"
          >
            <option value="Canada">Canada - 50x70 mm | 5x7 cm</option>
            <option value="UK">
              UK, Europe, Australia, etc. - 35x45 mm | 3.5x4.5 cm
            </option>
            <option value="US">US and India - 51x51 mm | 5x5 cm</option>
            <option value="China">China - 33x48 mm | 390x567 px</option>
          </select>
        </div>
        <div
          className="sizer-container rounded"
          style={{ width: sizes.width, height: sizes.height }}
        >
          <AvatarEditor
            image={sourceImage}
            width={sizes.width}
            height={sizes.height}
            border={0}
            ref={(editor) => (this.editor = editor)}
            scale={scale}
          />
          <img src={personOverlay} className="overlay" alt="Person Overlay" />
        </div>
        <div className="zoom-controls">
          <div className="zoom-out" onClick={partial(this.changeScale, -0.1)}>
            <MdRemoveCircleOutline />
          </div>
          <div className="slider">
            <RangeInput
              min={0.1}
              max={10}
              step={0.1}
              defaultValue={scale}
              value={scale}
              onChange={this.handleRangeChange.bind(this)}
            />
          </div>
          <div className="zoom-in" onClick={partial(this.changeScale, 0.1)}>
            <MdAddCircleOutline />
          </div>
        </div>
        <div className="button-group">
          <button
            onClick={this.handleProcessImage.bind(this)}
            className="btn btn-warning"
          >
            {this.props.isProcessing ? "Processing..." : "Process"}
          </button>
          <button
            onClick={this.toggleGridMode.bind(this)}
            className="btn btn-info"
          >
            {gridMode ? "Single Mode" : "Grid Mode"}
          </button>
        </div>
      </div>
    );
  }

  handleCountryChange(e) {
    const selectedCountry = e.target.value;
    const sizes = this.getDimensionsForCountry(selectedCountry);
    this.setState({ selectedCountry, sizes });
  }

  handleProcessImage() {
    const canvas = this.editor.getImageScaledToCanvas();
    const croppedImage = canvas.toDataURL();

    if (this.state.gridMode) {
      this.createGridImage(
        croppedImage,
        this.state.sizes.width,
        this.state.sizes.height
      );
    } else {
      this.props.processImage(croppedImage);
    }
  }

  getDimensionsForCountry(country) {
    switch (country) {
      case "Canada":
        return { width: 480, height: 672 }; // 50x70 mm
      case "UK":
        return { width: 336, height: 432 }; // 35x45 mm
      case "US":
        return { width: 480, height: 480 }; // 51x51 mm
      case "China":
        return { width: 317, height: 460 }; // 33x48 mm
      default:
        return { width: 480, height: 672 }; // Default to Canada
    }
  }

  createGridImage(dataUrl, width, height) {
    const img = new Image();
    img.src = dataUrl;
    img.onload = () => {
      const canvas = document.createElement("canvas");
      canvas.width = width * 2;
      canvas.height = height * 3;
      const ctx = canvas.getContext("2d");

      for (let x = 0; x < 2; x++) {
        for (let y = 0; y < 3; y++) {
          ctx.drawImage(
            img,
            0,
            0,
            width,
            height,
            x * width,
            y * height,
            width,
            height
          );
        }
      }

      const gridDataUrl = canvas.toDataURL();
      this.props.processImage(gridDataUrl);
    };
  }

  handleRangeChange(e) {
    this.setState({ scale: parseFloat(e.target.value) });
  }

  changeScale(delta) {
    const scale = this.state.scale + delta;
    this.setState({ scale });
  }

  toggleGridMode() {
    this.setState((prevState) => ({ gridMode: !prevState.gridMode }));
  }

  static getImage() {
    return this.editor.getImage();
  }
}
