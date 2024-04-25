# e-motion-web

## Project setup
### Project initialization
```
make init
```
### Run project
```
make run
```
### Attach shell to project container
```
make shell
```
### Stop project
```
make stop
```
### remove project image
```
make img-clean
```
### lint project
```
make lint
```
### prune docker (in case of any issues with the project)
```
make prune
```
## Commands to run inside container:
### Compiles and minifies for production
```
npm run build
```

### Run your unit tests
```
npm run test:unit
```

### Run your end-to-end tests
```
npm run test:e2e
```
