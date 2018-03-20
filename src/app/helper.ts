export class Helper {
    public findParam(object, name) {
        return object.find(param => param.title === name);
    }
}
