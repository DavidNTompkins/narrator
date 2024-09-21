const ImageComponent = ({ data, bio, mobile,transVisible,alttext,inactive}) => {
    const srcString = data?.[0] != "i" ? data : `data:image/png;base64,${data}`;
    return (
      <>
        <img src={srcString} style={{ filter: inactive ? "grayscale(100%)" : "none",
        WebkitTouchCallout: "none" }} alt={alttext} />
            </>
    );
  };

export default ImageComponent