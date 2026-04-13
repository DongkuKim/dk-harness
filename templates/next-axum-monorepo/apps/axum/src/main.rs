use axum::{routing::get, Router};
use std::net::SocketAddr;

#[tokio::main]
async fn main() {
    let app = Router::new().route("/", get(root)).route("/health", get(health));

    let address = SocketAddr::from(([127, 0, 0, 1], 3001));
    let listener = tokio::net::TcpListener::bind(address)
        .await
        .expect("failed to bind TCP listener");

    println!("axum server listening on http://{address}");

    axum::serve(listener, app)
        .await
        .expect("axum server failed");
}

async fn root() -> &'static str {
    "axum server"
}

async fn health() -> &'static str {
    "ok"
}
