document.addEventListener('DOMContentLoaded', function () {
    const chooseImage = document.querySelector('.choose_image');
    const uploadImgBox = document.querySelector('.upload_img_box');
    const selectedImageLabel = document.getElementById('selectedImage-label');
    let selectedImageInput = document.getElementById('selectedImage');
    const filterIcon = document.getElementById('filter-icon');
    const filtersElement = document.querySelector('.filters');
    const sidebarItems = document.querySelectorAll('.sidebar li');
    const removeButton = document.getElementById('remove_img_btn');
    const cropIcon = document.getElementById('crop-icon');
    const save = document.querySelector('.save');
    const download = document.querySelector('.download');
    const brightnessIcon = document.getElementById('brightness-icon');
    const blurIcon = document.getElementById('blur-icon');
    const saturateIcon = document.getElementById('saturation-icon');
    const brightSlider = document.querySelector('.bright');
    const blurSlider = document.querySelector('.blur');
    const saturateSlider = document.querySelector('.saturate');
    const rotateLeftIcon = document.getElementById('rotateleft-icon');
    const rotateRightIcon = document.getElementById('rotateright-icon');

    const brightnessSlider = document.getElementById('brightness');
    const brightnessValue = document.getElementById('brightVal');
    const blurnessSlider = document.getElementById('blurness');
    const blurnessValue = document.getElementById('blurVal');
    const saturationSlider = document.querySelector('.saturate'); // Change this to the container element
    const saturationValue = document.getElementById('saturateVal');

    let rotationAngle = 0;
    let activeFilter = null;
    let originalChooseImageContent = chooseImage.innerHTML;
    let imgPreview;
    let selectedFiles = [];
    let cropper;


    let appliedFilters = {
        brightness: null,
        blur: null,
        saturate: null
    };
    // Event listener for the filter options
    filtersElement.addEventListener('click', function (event) {
        if (event.target.classList.contains('filters')) {
            filtersElement.style.visibility = 'hidden';
        } else if (event.target.tagName === 'IMG') {
            // Get the data-filter attribute of the clicked filter option
            const filterName = event.target.parentElement.getAttribute('data-filter');

            // Apply the selected filter
            applyFilter(filterName);
        }
    });

    function togglevisibilty() {

        filtersElement.style.visibility = 'hidden';
        blurSlider.style.visibility = 'hidden';
        brightSlider.style.visibility = 'hidden';
        saturateSlider.style.visibility = 'hidden';
    }
    // Function to apply the selected filter to the image
    function applyFilter(filterName) {
        const filterValue = getFilterValue(filterName);
        imgPreview.style.filter = filterValue;

    }

    // Function to get the filter value based on the filter name
    function getFilterValue(filterName) {
        switch (filterName) {
            case 'retro':
                return 'grayscale(100%)';
            case 'vintage':
                return 'sepia(30%)';
            case 'film':
                return 'contrast(150%)';
            case 'clear':
                return 'none';
            default:
                return 'none';
        }
    }

    function toggleFilterSlider(sliderElement) {
        if (activeFilter === sliderElement) {
            sliderElement.style.visibility = 'hidden';
            activeFilter = null;
        } else {
            if (activeFilter) {
                activeFilter.style.visibility = 'hidden';
            }
            sliderElement.style.visibility = 'visible';
            activeFilter = sliderElement;
        }
    }

    function rotateImage(degrees) {
        rotationAngle += degrees;
        imgPreview.style.transform = `rotate(${rotationAngle}deg)`;
        applyFilters(); // Apply filters again in case any are active
    }


    function handleImageSelection(selectedFile) {
        // Display the selected image in the choose_image div
        imgPreview = document.createElement('img');
        imgPreview.src = URL.createObjectURL(selectedFile);

        chooseImage.innerHTML = '';
        chooseImage.appendChild(imgPreview);

        selectedFiles.push(selectedFile); // Add the selected file to the array
    }


    selectedImageInput.addEventListener('change', function () {
        const selectedFile = selectedImageInput.files[0];

        if (selectedFile) {
            handleImageSelection(selectedFile);
        }
    });

    filterIcon.addEventListener('click', function () {
        if (selectedImageInput.files.length === 0) {
            alert("Please choose an image");
        } else {
            // Toggle visibility of filters element
            filtersElement.style.visibility = filtersElement.style.visibility === 'hidden' ? 'visible' : 'hidden';
        }
    });


        removeButton.addEventListener('click', function () {
            if (selectedImageInput.files.length === 0) {
                alert("Please choose an image");
            } else {
                var confirmation = confirm("Are you sure you want to remove the image?");
                if (confirmation) {
                    setTimeout(function () {
                        chooseImage.innerHTML = originalChooseImageContent;
                        selectedImageInput.value = null;
                        selectedFiles = [];
                        selectedImageInput.disabled = false;
                    }, 0);
                }
            }

            togglevisibilty(filtersElement);
        });


        cropIcon.addEventListener('click', function () {

            brightSlider.style.visibility = 'hidden';
            togglevisibilty(filtersElement);

            if (!selectedImageInput.files[0]) {
                alert("Please choose an image");
            } else {


                cropper = new Cropper(imgPreview, {
                    aspectRatio: 0, // Set the aspect ratio as per your requirements
                    viewMode: 0, // Set the desired view mode
                    autoCropArea: 0.8, // Set the initial auto crop area
                    background: false,// Disable the checkerboard background
                });

                // Show the cropping interface
                cropper.crop();

                // Disable the cropIcon button
                cropIcon.disabled = true;

                // Save the cropped image
                save.addEventListener('click', function () {
                    // Get the cropped canvas
                    const croppedCanvas = cropper.getCroppedCanvas();

                    // Convert the canvas to a data URL
                    const croppedImageURL = croppedCanvas.toDataURL();

                    // Create a new image element for the modified image
                    const newImgPreview = document.createElement('img');
                    newImgPreview.src = croppedImageURL;
                    newImgPreview.style.filter = imgPreview.style.filter;

                    // Replace the existing imgPreview with the newImgPreview
                    chooseImage.innerHTML = '';
                    chooseImage.appendChild(newImgPreview);

                    // Update the imgPreview reference to the newly created image element
                    imgPreview = newImgPreview;

                    // Destroy the cropper instance
                    cropper.destroy();
                    cropper = null;

                });

            }

        });

        // Function to apply filters to the image
        const applyFilters = () => {
            let filterString = '';
            if (appliedFilters.brightness !== null) {
                filterString += `brightness(${appliedFilters.brightness}%) `;
            }
            if (appliedFilters.blur !== null) {
                filterString += `blur(${appliedFilters.blur}px)`;
            }
            if (appliedFilters.saturate !== null) {
                filterString += `saturate(${appliedFilters.saturate}%) `;
            }
            imgPreview.style.filter = filterString;
        };



        brightnessIcon.addEventListener('click', function () {

            blurSlider.style.visibility = 'hidden';
            togglevisibilty(filtersElement);
            if (!selectedImageInput.files[0]) {
                alert("Please choose an image.")
            }

            else {

                toggleFilterSlider(brightSlider);


                brightnessSlider.addEventListener('input', function () {
                    const currentValue = brightnessSlider.value;
                    appliedFilters.brightness = currentValue;
                    brightnessValue.textContent = (currentValue - 100);
                    applyFilters();

                });

            }
        });

        blurIcon.addEventListener('click', function () {
              
            togglevisibilty(filtersElement);

            if (!selectedImageInput.files[0]) {
                alert("Please choose an image.")
            }

            else {

                toggleFilterSlider(blurSlider);


                blurnessSlider.addEventListener('input', function () {
                    const currentValue = blurnessSlider.value;
                    appliedFilters.blur = currentValue;
                    blurnessValue.textContent = currentValue;
                    applyFilters();

                });
            }
        });


        saturateIcon.addEventListener('click', function () {
            
            togglevisibilty(filtersElement);

            if (!selectedImageInput.files[0]) {
                alert("Please choose an image.")
            }

            else {

                toggleFilterSlider(saturationSlider);
                saturationSlider.querySelector('input').addEventListener('input', function () {
                    const currentValue = saturationSlider.querySelector('input').value;
                    appliedFilters.saturate = currentValue;
                    saturationValue.textContent = (currentValue - 100);
                    applyFilters();
                });

            }
        });

        rotateLeftIcon.addEventListener('click', function () {

            togglevisibilty();
            

            if (!selectedImageInput.files[0]) {
                alert("Please choose an image.");
            } else {
                rotateImage(-90); // Rotate left by 90 degrees
                pushCurrentState(); // Call this after rotating the image
            }
        });

        rotateRightIcon.addEventListener('click', function () {

            togglevisibilty(filtersElement);

            if (!selectedImageInput.files[0]) {
                alert("Please choose an image.");
            } else {
                rotateImage(90); // Rotate right by 90 degrees
                pushCurrentState(); // Call this after rotating the image
            }
        });


        save.addEventListener('click', function () {

            togglevisibilty(filtersElement);

            if (!selectedImageInput.files[0]) {
                alert("Please Choose an image");
            } else {
                // Create a canvas to draw the filtered and rotated image
                const canvas = document.createElement('canvas');
                const context = canvas.getContext('2d');

                // Adjust canvas size based on rotation
                const rotatedWidth = rotationAngle % 180 === 0 ? imgPreview.naturalWidth : imgPreview.naturalHeight;
                const rotatedHeight = rotationAngle % 180 === 0 ? imgPreview.naturalHeight : imgPreview.naturalWidth;

                canvas.width = rotatedWidth;
                canvas.height = rotatedHeight;

                // Apply the rotation and filters to the context before drawing the image
                context.translate(rotatedWidth / 2, rotatedHeight / 2);
                context.rotate(rotationAngle * Math.PI / 180);
                context.drawImage(imgPreview, -imgPreview.naturalWidth / 2, -imgPreview.naturalHeight / 2);
                context.filter = imgPreview.style.filter;

                // Get the canvas data URL
                const canvasDataURL = canvas.toDataURL('image/jpeg');

                // Store the canvas data URL as the original image data URL
                originalImageDataURL = canvasDataURL;

                // Temporary display for the saved changes
                imgPreview.src = canvasDataURL;

                // Store the canvas data URL as the original image data URL
                originalImageDataURL = canvasDataURL;

                // Reset the Cropper rotation to match the total rotation angle
                if (cropper) {
                    cropper.rotate(rotationAngle);
                }
            }

        });


        download.addEventListener('click', function () {

            togglevisibilty(filtersElement);

            if (!selectedImageInput.files[0]) {
                alert("Please Choose an image");
            } else {
                // Create a canvas to draw the filtered and rotated image
                const canvas = document.createElement('canvas');
                const context = canvas.getContext('2d');

                // Adjust canvas size based on rotation
                const rotatedWidth = rotationAngle % 180 === 0 ? imgPreview.naturalWidth : imgPreview.naturalHeight;
                const rotatedHeight = rotationAngle % 180 === 0 ? imgPreview.naturalHeight : imgPreview.naturalWidth;

                canvas.width = rotatedWidth;
                canvas.height = rotatedHeight;

                // Apply the rotation and filters to the context before drawing the image
                context.translate(rotatedWidth / 2, rotatedHeight / 2);
                context.rotate(rotationAngle * Math.PI / 180);
                context.drawImage(imgPreview, -imgPreview.naturalWidth / 2, -imgPreview.naturalHeight / 2);
                context.filter = imgPreview.style.filter;

                // Get the canvas data URL
                const canvasDataURL = canvas.toDataURL('image/jpeg');

                // Create a temporary anchor element for downloading
                const downloadLink = document.createElement('a');
                downloadLink.href = canvasDataURL;
                downloadLink.download = 'image.jpg';

                // Trigger the download
                downloadLink.click();
            }
        });

    });

