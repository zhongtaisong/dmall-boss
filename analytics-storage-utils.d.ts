declare module '@analytics/storage-utils' {
    interface StorageOptions {
     storage?: 'localStorage' | 'cookie' | 'sessionStorage' | 'global' | '*';
    }
 
    interface SetItemResult {
     value: string;
     oldValue: string | null;
     location: 'localStorage' | 'cookie' | 'sessionStorage' | 'global';
    }
 
    interface GetItemResult {
     [key: string]: string | undefined | null;
    }
 
    /**
    * Sets an item in the specified storage location.
    * 
    * @param key - The key under which the value is stored.
    * @param value - The value to store.
    * @param options - Optional settings to specify storage location.
    * @returns An object containing the new value, old value, and the storage location.
    */
    export function setItem(
     key: string, 
     value: string | IObject, 
     options?: StorageOptions
    ): SetItemResult;
 
    /**
    * Gets an item from the specified storage location.
    * 
    * @param key - The key of the value to retrieve.
    * @param options - Optional settings to specify storage location.
    * @returns The value stored under the specified key, or an object with values from all storages if `storage` is '*'.
    */
    export function getItem(
     key: string, 
     options?: StorageOptions
    ): string | null | GetItemResult;
 
    /**
    * Removes an item from the specified storage location.
    * 
    * @param key - The key of the value to remove.
    * @param options - Optional settings to specify storage location.
    * @returns void
    */
    export function removeItem(
     key: string, 
     options?: StorageOptions
    ): void;   
}
 