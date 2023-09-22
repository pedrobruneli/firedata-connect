# Firedata Connect

Firedata Connect is a simple firebase import and export data library
## Support
- [x]  Storage
- [x]  Firestore
- [ ]  Authentication

## Installation

```bash
  pnpm i --save-dev firedata-connect@latest
```
    
## API documentation

#### Firestore data import command

```bash
  firedata-import firestore --path firebase-data.json --serviceAccount serviceAccount.json
```

| Params   | Description                           | Default   |
| :---------- | :---------------------------------- | :-----   |
| `--path` | **Required**. The file path to be imported | -  |
| `--serviceAccount` | **Optional**. The service account of firebase project | Emulators  |
| `--emulators` | **Optional**. The emulators IP address | localhost:8085  |
| `--help` | **Optional**. Open the commands list | -  |
| `--version` | **Optional**. Shows your current lib version | -  |

####  Firestore data export command

```bash
  firedata-export firestore --path firebase-data.json --serviceAccount serviceAccount.json
```

| Params   | Description                           | Default   |
| :---------- | :---------------------------------- | :-----   |
| `--path` | **Required**. The file path to be exported | -  |
| `--serviceAccount` | **Optional**. The service account of firebase project | Emulators  |
| `--emulators` | **Optional**. The emulators IP address | localhost:8085  |
| `--help` | **Optional**. Open the commands list | -  |
| `--version` | **Optional**. Shows your current lib version | -  |

#### Storage data import command

```bash
  firedata-import storage --path storage-data-folder/ --bucket example-project.appspot.com --projectId example-project --serviceAccount serviceAccount.json
```

| Params   | Description                           | Default   |
| :---------- | :---------------------------------- | :-----   |
| `--path` | **Required**. The file and folders path to be uploaded | -  |
| `--bucket` | **Required**. The firebase storage bucket | -  |
| `--projectId` | **Required if don't using emulators**. The firebase project id | -  |
| `--serviceAccount` | **Optional**. The service account of firebase project | Emulators  |
| `--emulators` | **Optional**. The emulators IP address | localhost:9199  |
| `--help` | **Optional**. Open the commands list | -  |
| `--version` | **Optional**. Shows your current lib version | -  |

#### Storage data export command

```bash
  firedata-export storage --dest destination-folder/ --bucket example-project.appspot.com --projectId example-project --serviceAccount serviceAccount.json
```

| Params   | Description                           | Default   |
| :---------- | :---------------------------------- | :-----   |
| `--dest` | **Required**. The destination folder | -  |
| `--bucket` | **Required**. The firebase storage bucket | -  |
| `--projectId` | **Required if don't using emulators**. The firebase project id | -  |
| `--path` | **Optional** Path to be exported in bucket if needed | -  |
| `--serviceAccount` | **Optional**. The service account of firebase project | Emulators  |
| `--emulators` | **Optional**. The emulators IP address | localhost:9199  |
| `--help` | **Optional**. Open the commands list | -  |
| `--version` | **Optional**. Shows your current lib version | -  |

## Examples

#### Firestore data JSON example:

```json
{
  "__collections": {
    "Collection": {
      "documentId": {
        "docReference": {
          "__datatype__": "reference",
          "value": { "path": "collection/anotherdocumentid" }
        },
        "test": "test",
        "created_at": {
          "__datatype__": "timestamp",
          "value": { "seconds": 1695343756, "nanoseconds": 508000000 }
        },
        "geolocation": {
          "__datatype__": "geopoint",
          "value": { "latitude": 25, "longitude": 71 }
        }
      }
    }
  }
}
```


## Contribuiting

Be free to open an issue or pull request!

## Contribuitors

- [@pedrobruneli](https://www.github.com/pedrobruneli)

