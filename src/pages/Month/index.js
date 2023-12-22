import { useEffect, useState } from 'react';
import Header from '../../components/Header';
import './month.css';
import { db } from '../../services/firebaseConnection';
import { collection, doc, getDocs } from 'firebase/firestore';
import { FiPlusCircle } from "react-icons/fi";
import CreateMonth from '../../components/CreateMonth';
import MonthList from '../../components/MonthList';
import loadImage from '../../images/load.svg';

function Month() {
  const [closeModal, setCloseModal] = useState(false);
  const [lista, setLista] = useState([]);
  const [monthName] = useState([
    'Dezembro', 'Novembro', 'Outubro', 'Setembro', 'Agosto', 'Julho', 'Junho', 'Maio', 'Abril', 'Março', 'Fevereiro','Janeiro'
  ]);
  const [refreshAll, setRefreshAll] = useState(false);

  const [permission, setPermission] = useState(false);

    useEffect(()=>{
        async function loadAdm(){
            const storageUser = localStorage.getItem('@user');
            if(storageUser){
                const user = JSON.parse(storageUser);
                if(user.uid === 'TGOTiRQEBgawgkCTKldfGocsgS93') setPermission(true);
                
            }

        }

        loadAdm();

    });

  useEffect(() => {
    async function load() {
        const anosTemp = [];
        setLista([]);
        //Aqui acessamos a primeira collection 'anos' no banco de dados e pegamos os anos que estão dentro deles.
        try {
        const snapshot = await getDocs(collection(db, 'anos'));
        snapshot.forEach((item) => {
            anosTemp.push({ ano: item.id });
        });

        // Criamos uma lista central que será passada para a lista principal ao final das renderizações.
        const listaData = [];

        // Aqui para cada ano que for achado no banco de dados criamos um loop e criamos a array deste ano.
        for (const anoNome of anosTemp) {
            //Acessamos o banco de dados dos anos com cada ano pego.
            const docRef = doc(db, 'anos', anoNome.ano);
            // Criamos a primeira parte da array, separando cada Ano e colocando a lista de cada mês.
            const artilhariMes = {
            year: anoNome.ano,
            eachMonth: []
        };

        await Promise.all(

            // Aqui pegamos a array de meses pré definidas e fazemos um loop para todas elas.
            monthName.map(async (mes) => {
            try {
                // Aqui pegamos a coleção de anos dentro de cada ano já estabelecida e criamos um loop para cada mês dentro dela.
                const mesRef = collection(docRef, mes);
                const dataP = await getDocs(mesRef);

                // Verificamos quais meses estão vazios.
                if (dataP.empty) {
                  return; // Ignora meses vazios.
                }

                // Criamos uma data para armazenar cada mês dentro da eachMonth, todos os meses de um ano vão ser separados nesta parte.
                const data = {
                    mesNome: mes,
                    artilharia: []
                };

                // Para cada Mês que foi pega e não estava vazio pegamos as informações dos jogadores dentro deles e jogamos dentro da artilharia.
                dataP.forEach((snapshot) => {
                    data.artilharia.push(snapshot.data());
                });

                // Agora depois de todos os nomes na artilharia e o mês definido pelo nome, jogamos todas as informações de um mês dentro da array que vai estar com todos os meses.
                artilhariMes.eachMonth.push(data);
            } catch {
                console.log('Algo deu Errado')
                }
            })
        );
            //Evita renderizações desnecessárias.
            if (artilhariMes.eachMonth.length > 0) {
            listaData.push(artilhariMes);
            }
        }

        setLista(listaData.reverse());
        } catch (error) {
        console.error('Erro ao carregar os dados:', error);
        }
    }

    load();

  }, [refreshAll]);


  return (
        <div className="month-container">
            {permission && (
                <>
                    <label className='month-button'>
                        <button onClick={() => setCloseModal(true)}>
                            <FiPlusCircle style={{ marginRight: '10px' }} /> Criar Mês
                        </button>
                    </label>
                </>
            )}
        <Header />
            <div className='month-area'>
                {lista.length > 0 ? (
                <MonthList data={lista}/>
                ) : (
                    <div className='load-area'>
                        <img src={loadImage} alt='carregando' />
                    </div>
                )}
                {closeModal && (
                <CreateMonth closeModal={() => setCloseModal(!closeModal)} atualizarAnos={()=> setRefreshAll(!refreshAll)} permisson={permission}/>
                )}
            </div>
        </div>
    );
}

export default Month;
