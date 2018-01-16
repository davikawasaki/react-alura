# Alura Course - Parte 1

This repository covers code from [First React Alura Course](https://cursos.alura.com.br/course/react).

## Steps to run and build

These steps work for cdc-admin/ folder. The no-cli covers manual dependency injection, and it's not working.

1\. Run Back-End Spring API with Java (needs Java and MySQL installed):

```bash
$ java -Dspring.datasource.password=<MYSQL-PASSWORD> -jar jar-cdc-react.jar
```

If you don't want to use a local API, you can use the hosted version on Heroku. Change all AJAX requests on components to [this URL](https://cdc-react.herokuapp.com/api).

2\. Install react project dependencies with NPM:

```bash
$ cd cdc-admin/
$ npm install
```

3\. Run without building:

```bash
$ npm start
```

4\. Build application with [Create React App](https://github.com/facebookincubator/create-react-app):

```bash
$ npm run build
```