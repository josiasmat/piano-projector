/*
Local browser storage handler module
Copyright (C) 2024 Josias Matschulat

This program is free software: you can redistribute it and/or modify
it under the terms of the GNU Affero General Public License as
published by the Free Software Foundation, either version 3 of the
License, or (at your option) any later version.

This program is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
GNU Affero General Public License for more details.

You should have received a copy of the GNU Affero General Public License
along with this program.  If not, see <https://www.gnu.org/licenses/>.
*/

class GenericStorageHandler {

    /** @type {Storage} */
    #storage_object = null;
    #prefix = "";

    /**
     * Creates a new storage handler object.
     * @param {String} type "local" or "session".
     * @param {String} prefix unique prefix to prepend to all keys.
     */
    constructor(type, prefix) {
        switch (type) {
            case "local":
                this.#storage_object = localStorage;
                break;
            case "session":
                this.#storage_object = sessionStorage;
                break;
            default:
                throw Error(`Invalid storage type: "${type}".`);
        }
        if ( prefix != "" ) this.#prefix = prefix+"_";
        this.#prefix.replace(" ", "_");
    }

    #with_prefix(s) {
        return this.#prefix + s;
    }

    // from https://developer.mozilla.org/en-US/docs/Web/API/Web_Storage_API/Using_the_Web_Storage_API
    isAvailable() {
        try {
            const x = "__storage_test__";
            this.#storage_object.setItem(x, x);
            this.#storage_object.removeItem(x);
            return true;
        } catch (e) {
            return (
                e instanceof DOMException &&
                e.name === "QuotaExceededError" &&
                // acknowledge QuotaExceededError only if there's something already stored
                this.#storage_object &&
                this.#storage_object.length !== 0
            );
        }
    }

    /**
     * Reads a string value from storage.
     * @param {String} key name of the key.
     * @param {String} default_value optional; value to return if key doesn't exist
     *      or if local storage is not available. Defaults to an empty string.
     * @returns {String} string value from local storage, or *default_value*.
     */
    readString(key, default_value = "") {
        try {
            if ( !this.isAvailable() ) throw Error("Storage not available");
            const val = this.#storage_object.getItem(this.#with_prefix(key));
            return (val == null) ? default_value : val;
        } catch {
            return default_value;
        }
    }

    /**
     * Writes a string value to storage.
     * @param {String} key name of the key.
     * @param {String} value value to write.
     * @returns {Boolean} _true_ if write succeeds, _false_ otherwise.
     */
    writeString(key, value) {
        try {
            if ( !this.isAvailable() ) throw Error("Storage not available");
            this.#storage_object.setItem(this.#with_prefix(key), String(value));
        } catch {
            return false;
        }
        return true;
    }

    /**
     * Reads a number value from storage.
     * @param {String} key name of the key.
     * @param {Number} default_value optional; value to return if key doesn't exist
     *      or if local storage is not available. Defaults to zero.
     * @returns {Number} number value from local storage, or *default_value*.
     */
    readNumber(key, default_value = 0) {
        const val = this.readString(key, default_value);
        if ( isNaN(val) ) return default_value;
        return Number(val);
    }

    /**
     * Writes a number value to storage.
     * @param {String} key name of the key.
     * @param {Number} value value to write.
     * @returns {Boolean} _true_ if write succeeds, _false_ otherwise.
     */
    writeNumber(key, value) {
        if ( isNaN(value) ) return false;
        return this.writeString(key, String(value));
    }

    /**
     * Reads a boolean value from storage.
     * @param {String} key name of the key.
     * @param {Boolean} default_value optional; value to return if key doesn't exist
     *      or if local storage is not available. Defaults to _false_.
     * @returns {Boolean} boolean value from local storage, or *default_value*.
     */
    readBool(key, default_value = false) {
        const val = this.readString(key, default_value);
        if ( val === default_value ) return default_value;
        return ( String(val) === String(true) );
    }

    /**
     * Writes a boolean value to storage.
     * @param {String} key name of the key.
     * @param {Boolean} value value to writey.
     * @returns {Boolean} _true_ if write succeeds, _false_ otherwise.
     */
    writeBool(key, value) {
        return this.writeString(key, String(Boolean(value)));
    }

    /**
     * Removes a stored value.
     * @param {String} key name of the key to remove.
     * @returns {Boolean} _true_ if removed, _false_ otherwise.
     */
    remove(key) {
        try {
            if ( !this.isAvailable() ) throw Error("Storage not available");
            this.#storage_object.removeItem(this.#with_prefix(key));
        } catch {
            return false;
        }
        return true;
    }

    /**
     * Checks if the specified key has a stored value.
     * @param {String} key name of the key.
     * @returns {Boolean} _true_ if there is a value associated with _key_,
     *       _false_ otherwise.
     */
    has(key) {
        return ( this.isAvailable() && 
                 this.#storage_object.getItem(this.#with_prefix(key)) !== null );
    }

    /**
     * Returns a list with the stored keys.
     * @returns {String[]} list of stored keys.
     */
    get keys() {
        const prefix_length = this.#prefix.length;
        return Object.keys(this.#storage_object)
               .filter(key => key.startsWith(this.#prefix))
               .map(key => key.substring(prefix_length));
    }

    /**
     * Returns a list with the stored key/value pairs.
     * @returns {[string, string]} list of stored key/value pairs.
     */
    get entries() {
        const prefix_length = this.#prefix.length;
        return Object.entries(this.#storage_object)
               .filter(e => e[0].startsWith(this.#prefix))
               .map(([k,v]) => [k.substring(prefix_length), v]);
    }

    /**
     * Removes all stored key/value pairs.
     */
    clear() {
        for ( let key of this.keys ) {
            this.remove(key);
        }
    }

}


export class LocalStorageHandler extends GenericStorageHandler {
    constructor(prefix) {
        super("local", prefix);
    }
}


export class SessionStorageHandler extends GenericStorageHandler {
    constructor(prefix) {
        super("session", prefix);
    }
}
