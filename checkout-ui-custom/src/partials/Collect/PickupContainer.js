const PickupContainer = () => `<div class="pickup-map-container" id="tfg-pickup-container">
          <div class="pickup-map-icon">
            <svg class="icon-map" xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 48 48" fill="none">
              <rect width="48" height="48" rx="24" fill="#2424E4"/>
              <path d="M24.2147 11C21.5065 11.0031 18.9102 12.0802 16.9952 13.9952C15.0802 15.9102 14.0031 18.5065 14 21.2147C14 29.9552 23.2861 36.5599 23.6807 36.8385C23.8389 36.9438 24.0247 37 24.2147 37C24.4047 37 24.5905 36.9438 24.7486 36.8385C25.1433 36.5599 34.4294 29.9552 34.4294 21.2147C34.4263 18.5065 33.3491 15.9102 31.4342 13.9952C29.5192 12.0802 26.9228 11.0031 24.2147 11ZM24.2147 17.5003C24.9493 17.5003 25.6675 17.7181 26.2783 18.1262C26.8891 18.5344 27.3652 19.1145 27.6464 19.7932C27.9275 20.472 28.0011 21.2188 27.8577 21.9393C27.7144 22.6599 27.3607 23.3217 26.8412 23.8412C26.3217 24.3607 25.6599 24.7144 24.9393 24.8577C24.2188 25.0011 23.472 24.9275 22.7932 24.6464C22.1145 24.3652 21.5344 23.8891 21.1262 23.2783C20.7181 22.6675 20.5003 21.9493 20.5003 21.2147C20.5003 20.2296 20.8916 19.2848 21.5882 18.5882C22.2848 17.8916 23.2296 17.5003 24.2147 17.5003Z" fill="#FCFCFC"/>
            </svg>
            Find nearby collect points
            <div class="pickup-map-text">
              Search for addresses that you frequently use and we’ll locate stores nearby.
            </div>
          </div>
          <button class="pickup-map-geolocation" id="find-pickups-button-new" type="button">
            <svg xmlns="http://www.w3.org/2000/svg" width="15" height="16" viewBox="0 0 15 16" fill="none">
              <path d="M1.12954 2.34666L5.24985 14.2506C5.42563 14.7639 6.15688 14.7498 6.3186 14.2295L7.97798 8.84354C8.00302 8.75549 8.05054 8.67548 8.11588 8.61138C8.18122 8.54727 8.26213 8.50127 8.35063 8.47791L13.7295 6.81854C14.2499 6.65682 14.2639 5.92557 13.7506 5.74979L1.84672 1.62948C1.74671 1.59433 1.6388 1.58815 1.53542 1.61167C1.43205 1.63519 1.33743 1.68745 1.26247 1.76241C1.18751 1.83737 1.13525 1.93199 1.11173 2.03536C1.08822 2.13873 1.09439 2.24665 1.12954 2.34666V2.34666Z" stroke="#2424E4" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
            Use my current location
          </button>
          <button class="pickup-map-manual" id="find-pickups-manually-search">
            Manually search for an address
          </button>
        </div>`;

export default PickupContainer;
