import Api from '../services/api'

class balance {
    async view(address) {
        var resposta;
        await Api.post(`/balance/${address}`)
            .then(response => {
                resposta = response;
            })
            .catch(error => {
                resposta = { error }
            })
        return resposta;
    }
}

const Balance = new balance();
export default Balance;
