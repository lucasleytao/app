document.addEventListener('DOMContentLoaded', function () {
    const form = document.querySelector('form');
    const listaMaterias = document.getElementById('lista-materias');

    // Carrega as matérias armazenadas localmente ao iniciar a aplicação
    carregarMateriasArmazenadas();

    form.addEventListener('submit', function (event) {
        event.preventDefault();

        const materiaInput = document.getElementById('materia');
        const horarioInput = document.getElementById('horario');

        const materia = materiaInput.value;
        const horario = horarioInput.value;

        if (materia && horario) {
            adicionarMateriaNaLista(materia, horario);
            adicionarMateriaAoArmazenamentoLocal(materia, horario);
            limparCamposDoFormulario();
        }
    });

    function adicionarMateriaNaLista(materia, horario) {
        const materiaItem = document.createElement('tr');
        materiaItem.innerHTML = `
            <td>${materia}</td>
            <td>${horario}</td>
            <td>
                <button class="editar-btn">Editar</button>
                <button class="excluir-btn">Excluir</button>
            </td>
        `;

        listaMaterias.appendChild(materiaItem);

        const editarBtn = materiaItem.querySelector('.editar-btn');
        const excluirBtn = materiaItem.querySelector('.excluir-btn');

        // Adiciona eventos para os botões editar e excluir
        editarBtn.addEventListener('click', function () {
            editarMateria(materiaItem, materia, horario);
        });

        excluirBtn.addEventListener('click', function () {
            excluirMateria(materiaItem, materia, horario);
        });
    }

    function adicionarMateriaAoArmazenamentoLocal(materia, horario) {
        const materiasArmazenadas = obterMateriasArmazenadas();
        materiasArmazenadas.push({ nome: materia, horario: horario });
        atualizarMateriasArmazenadas(materiasArmazenadas);
    }

    function editarMateria(materiaItem, materiaAntiga, horarioAntigo) {
        const novoNome = prompt('Novo nome da matéria:', materiaAntiga);
        const novoHorario = prompt('Novo horário de estudo:', horarioAntigo);

        if (novoNome !== null && novoHorario !== null) {
            // Remove a matéria antiga
            excluirMateria(materiaItem, materiaAntiga, horarioAntigo);
            // Adiciona a matéria editada
            adicionarMateriaNaLista(novoNome, novoHorario);
            // Atualiza o armazenamento local
            atualizarMateriasArmazenadas(obterMateriasArmazenadas());
        }
    }

    function excluirMateria(materiaItem, materia, horario) {
        if (confirm(`Tem certeza que deseja excluir a matéria "${materia}"?`)) {
            // Remove a matéria da lista
            if (materiaItem) {
                listaMaterias.removeChild(materiaItem);
            }
            // Remove a matéria do armazenamento local
            const materiasArmazenadas = obterMateriasArmazenadas();
            const novaListaMaterias = materiasArmazenadas.filter(item =>
                item.nome !== materia || item.horario !== horario
            );
            atualizarMateriasArmazenadas(novaListaMaterias);
        }
    }

    function carregarMateriasArmazenadas() {
        const materiasArmazenadas = obterMateriasArmazenadas();
        materiasArmazenadas.forEach(materia => {
            adicionarMateriaNaLista(materia.nome, materia.horario);
        });
    }

    function obterMateriasArmazenadas() {
        return JSON.parse(localStorage.getItem('materias')) || [];
    }

    function atualizarMateriasArmazenadas(materias) {
        localStorage.setItem('materias', JSON.stringify(materias));
    }

    function limparCamposDoFormulario() {
        document.getElementById('materia').value = '';
        document.getElementById('horario').value = '';
    }
});
