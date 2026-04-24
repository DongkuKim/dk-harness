set shell := ["bash", "-cu"]

install:
  mise install

self-check:
  pnpm run repo:self-check

supply-chain:
  pnpm run repo:supply-chain

ci: self-check supply-chain
