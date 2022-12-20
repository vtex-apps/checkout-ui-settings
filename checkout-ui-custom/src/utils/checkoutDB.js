class CheckoutDB {
  constructor() {
    this.indexedDB =
      window.indexedDB || window.webkitIndexedDB || window.mozIndexedDB || window.msIndexedDB || window.shimIndexedDB;

    this.checkoutDB = indexedDB.open('checkoutDB', 1.2);

    this.checkoutDB.onerror = (event) => {
      console.error('CheckoutDB Error', { event });
      throw new Error('Could not load checkoutDB');
    };

    this.checkoutDB.onupgradeneeded = () => {
      const db = this.checkoutDB.result;
      const store = db.createObjectStore('addresses', { keyPath: 'addressName' });
      store.createIndex('address_street', ['street'], { unique: false });
      store.createIndex('address_addressName', ['addressName'], { unique: true });
      store.createIndex('address_street_suburb_city_postal', ['street', 'neighborhood', 'city', 'postalCode'], {
        unique: true,
      });
    };

    this.checkoutDB.onsuccess = () => {
      const db = this.checkoutDB.result;
      const transaction = db.transaction('addresses', 'readwrite');
      this.addresses = transaction.objectStore('addresses');

      // Close DB connection
      transaction.oncomplete = () => {
        // db.close();
      };
    };
  }

  store() {
    const db = this.checkoutDB.result;
    const transaction = db.transaction('addresses', 'readwrite');
    return transaction.objectStore('addresses');
  }

  loadAddresses(addresses) {
    const queries = addresses.map((address) => this.addOrUpdateAddress(address));
    return Promise.all(queries).then((values) => values);
  }

  addOrUpdateAddress(address) {
    const thisDb = this;
    return new Promise((resolve, reject) => {
      const query = thisDb.store().put(address);

      query.onsuccess = () => {
        resolve({ success: true, addressId: query.result });
      };

      query.onerror = (error) => {
        reject(new Error({ sucess: false, error: error?.target?.error }));
      };
    });
  }

  getAddresses() {
    const thisDb = this;
    return new Promise((resolve) => {
      const query = thisDb.store().getAll();

      query.onsuccess = () => resolve(query.result);

      query.onerror = () => {
        console.error('Something wrong with getAddresses ? ...');
        resolve([]);
      };
    });
  }

  getAddress(id) {
    const thisDb = this;
    return new Promise((resolve) => {
      const query = thisDb.store().get(id);

      query.onsuccess = () => resolve(query.result);

      query.onerror = () => {
        console.error('Something wrong with getAddress ? ...');
        resolve([]);
      };
    });
  }

  deleteAddress(id) {
    const query = this.addresses.delete(id);
    query.onsuccess = () => query.result;
  }

  clearData() {
    const thisDb = this;
    return new Promise((resolve) => {
      const query = thisDb.store().clear();

      query.onsuccess = () => resolve(query.result);

      query.onerror = () => {
        console.error('Something wrong with clearData ? ...');
        resolve([]);
      };
    });
  }
}

export default CheckoutDB;
