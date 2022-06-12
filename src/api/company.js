import service from "../utils/request";

export function FindAllCompany() {
    return service({
        url: '/company',
        method: 'get'
    })
}

export function SearchCompany(name) {
    return service({
        url: '/company/search/' + name,
        method: 'get'
    })
}

export function SaveCompany(data) {
    return service({
        url: '/company',
        method: 'post',
        data: data
    })
}
export function DeleteCompanyById(id) {
    return service({
        url: '/company?id=' + id,
        method: 'delete'
    })
}