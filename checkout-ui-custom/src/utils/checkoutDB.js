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
    const queries = [];
    console.info('loadAddresses', { addresses });
    return Promise.all(addresses.map((address) => this.addOrUpdateAddress(address))).then((loadedAddress) => {
      console.info({ loadedAddress, queries });
    });
  }

  addOrUpdateAddress(address) {
    console.info('addOrUpdateAddress', { address });
    const thisDb = this;
    return new Promise((resolve, reject) => {
      const query = thisDb.store().put(address);

      query.onsuccess = () => {
        console.info('addOrUpdateAddress success');
        resolve(query.result);
      };

      query.onerror = () => {
        console.error('Something wrong with addOrUpdateAddress ? ...');
        reject(new Error('Address could not be stored locally'));
      };
    });
  }

  getAddresses() {
    const thisDb = this;
    return new Promise((resolve) => {
      const query = thisDb.store().getAll();

      query.onsuccess = () => {
        console.info('getAddresses success');
        resolve(query.result);
      };

      query.onerror = () => {
        console.error('Something wrong with getAddresses ? ...');
        resolve([]);
      };
    });
  }

  getAddress(id) {
    const query = this.addresses.get(id);
    query.onsuccess = () => {
      console.info('getAddress', query.result);
      return query.result;
    };
  }

  deleteAddress(id) {
    const query = this.addresses.delete(id);
    query.onsuccess = () => {
      console.info('deleteAddress', query.result);
      return query.result;
    };
  }

  dropDB() {
    this.indexedDB.deleteDatabase('checkoutDB');
  }
}

export default CheckoutDB;
