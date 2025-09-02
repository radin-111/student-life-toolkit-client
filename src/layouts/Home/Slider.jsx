import React from "react";
import image1 from "../../assets/slider1.jpg";
import image2 from "../../assets/slider2.jpg";
import image3 from "../../assets/slider3.jpg";

const Slider = () => {
  return (
    <div className="carousel w-full">
      <div id="slide1" className="carousel-item relative w-full">
        <img
          src={image1}
          className="w-full object-cover"
        />
        <div className="absolute left-5 right-5 top-1/2 flex -translate-y-1/2 transform justify-between">
          <a href="#slide4" className="btn btn-circle">
            ❮
          </a>
          <a href="#slide2" className="btn btn-circle">
            ❯
          </a>
        </div>
      </div>
      <div id="slide2" className="carousel-item relative w-full">
        <img
          src={image2}
          className="w-full object-cover"
        />
        <div className="absolute left-5 right-5 top-1/2 flex -translate-y-1/2 transform justify-between">
          <a href="#slide1" className="btn btn-circle">
            ❮
          </a>
          <a href="#slide3" className="btn btn-circle">
            ❯
          </a>
        </div>
      </div>
      <div id="slide3" className="carousel-item relative w-full">
        <img
          src={image3}
        />
        <div className="absolute left-5 right-5 top-1/2 flex -translate-y-1/2 transform justify-between">
          <a href="#slide2" className="btn btn-circle">
            ❮
          </a>
          <a href="#slide4" className="btn btn-circle">
            ❯
          </a>
        </div>
      </div>
      <div id="slide4" className="carousel-item relative w-full">
        <img
          src="https://cdn.qwenlm.ai/output/24058570-a08d-412a-b885-c2c9cef0d4a7/t2i/eed99e8e-1a21-4fd5-bde7-41c4b2cb16e4/1752227977.png?key=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJyZXNvdXJjZV91c2VyX2lkIjoiMjQwNTg1NzAtYTA4ZC00MTJhLWI4ODUtYzJjOWNlZjBkNGE3IiwicmVzb3VyY2VfaWQiOiIxNzUyMjI3OTc3IiwicmVzb3VyY2VfY2hhdF9pZCI6IjAwY2U0OTAxLTIwMGMtNDJjMy04YzBhLWY5OTQwZTUwZmE0ZiJ9.D9Po5smgBwFZV3zpCCVGraDQ8H82mHbO1C44Z00nqwc"
          className="w-full object-cover"
        />
        <div className="absolute left-5 right-5 top-1/2 flex -translate-y-1/2 transform justify-between">
          <a href="#slide3" className="btn btn-circle">
            ❮
          </a>
          <a href="#slide1" className="btn btn-circle">
            ❯
          </a>
        </div>
      </div>
    </div>
  );
};

export default Slider;
