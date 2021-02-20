import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { env } from "process";
import { Observable } from "rxjs";
import { map } from "rxjs/operators";
import { environment } from "src/environments/environment";
import { FbCreateResponse, Post } from "./interfaces";

@Injectable({
    providedIn: 'root'
})

export class PostService {
    constructor(
        private http: HttpClient,
        ) { }
    create(post: Post): Observable<Post> {
        return this.http.post(`${environment.fbDBUrl}/posts.json`, post)
        .pipe(
            map((response: FbCreateResponse) => {
                return {
                    ...post,
                    id: response.name,
                    date: new Date(post.date),
                } as Post
            })
        );
    }
    getAll() {
        return this.http.get(`${environment.fbDBUrl}/posts.json`)
        .pipe(
            map(
                (response: {[key: string]: any}) => {
                    return Object
                    .keys(response)
                    .map(
                        (key) => ({
                            ...response[key],
                            id: key,
                            date: new Date(response[key].date)
                        })
                    )
                }
            )
        )
    }
    getById(id: string): Observable<Post> {
        return this.http.get<Post>(`${environment.fbDBUrl}/posts/${id}.json`)
        .pipe(
            map((post: Post) => {
                return {
                    ...post, id,
                    date: new Date(post.date),
                } as Post
            })
        );
    }
    update(post: Post): Observable<Post> {
        return this.http.patch<Post>(`${environment.fbDBUrl}/posts/${post.id}.json`, post)
    }
    remove(id: string): Observable<void> {
        return this.http.delete<void>(`${environment.fbDBUrl}/posts/${id}.json`)
    }
}