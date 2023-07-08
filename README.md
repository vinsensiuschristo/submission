# REST MusicAPI

### Apa itu MusicAPI ?
REST MusicAPI adalah API yang digunakan untuk 
### Fitur Pada Aplikasi
* Users dapat mendaftar dan login dengan akun mereka.
* Public (non-authenticated) hanya bisa mengakes beberapa endpoint.
* Authenticated users dapat mengakses semua data pribadi akun tersebut baik membuat, mengedit, maupun menghapus enpoint Playlist, Album, Song, dan AlbumLike.
* Menggunakan Memurai untuk caching.
* Dapat mengupload foto.
* Dapat meng-export data Playlist.
* Menggukan Authorization sehingga data pribadi users aman.
### Panduan Insalasi
* Clone repositori ini.
* Jalankan `npm install` untuk meng-install semua dependencies.
* Buat sebuah `.env` file pada root folder dan tambahkan variable yang dibutuhkan. Lihat `.env.example` untuk lebih jelas.
* Jalankan `npm run migrate` untuk membuat table.
### Penggunaan
Untuk menjalankan Aplikasi :

    npm run start-dev

## API Endpoints
## Albums
| Endpoint | Body Request | Response | Keterangan |
| --- | --- | --- | --- |
| POST /albums | <ul><li>name: string</li><li>year: number</li></ul> | status code: 201 (created)<br> body:<ul><li>status:success</li><li>data:<ul><li>albumId: "album_id"</ul></li></li></ul> | Menambahkan Album. |
| GET /albums | - | status code: 200 (ok)<br> body:<ul><li>status:success</li><li>data:<ul><li>albumId: album | Mendapatkan album berdasarkan id. |
| PUT /albums/{id} | <ul><li>name: string</li><li>year: number</li></ul> | status code: 200 (ok)<br> body:<ul><li>status: success</li><li>message: any* | Mengubah album berdasarkan id album. |
| DELETE /albums/{id} | - | status code: 200 (ok)<br> body:<ul><li>status: success</li><li>message: any* | Menghapus album berdasarkan id album. |

### Output
`GET /album/{id}`

    {
        "status": "success",
        "data": {
            "album": {
            "id": "album-Mk8AnmCp210PwT6B",
            "name": "Viva la Vida",
            "year": 2008
            }
        }
    }


