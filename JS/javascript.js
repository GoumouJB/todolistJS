// Charger les tâches depuis le localStorage au démarrage de la page
document.addEventListener('DOMContentLoaded', chargerTaches);

// Fonction pour ajouter une nouvelle tâche
function ajouterTache() {
    let input = document.getElementById("task-input");
    let dateInput = document.getElementById("task-date");
    let task = input.value.trim();
    let taskDate = dateInput.value;

    if (task === "") {
        alert("Veuillez entrer une tâche.");
        return;
    }

    if (taskDate === "") {
        alert("Veuillez sélectionner une date.");
        return;
    }

    // Ajouter la tâche à la liste visuellement
    creerElementTache(task, taskDate);

    // Sauvegarder la tâche dans localStorage
    sauvegarderTacheDansLocalStorage(task, taskDate);

    // Vider les champs après avoir ajouté la tâche
    input.value = "";
    dateInput.value = "";
}

// Créer l'élément <li> pour la tâche
function creerElementTache(task, taskDate, isCompleted = false) {
    let li = document.createElement("li");

    // Ajouter la tâche et la date au <li>
    li.innerHTML = `
        ${task} 
        <span class="task-date">${taskDate}</span>
    `;

    // Si la tâche est complétée, appliquer la classe 'completed'
    if (isCompleted) {
        li.classList.add('completed');
    }

    // Bouton pour marquer la tâche comme complétée
    li.addEventListener("click", function() {
        li.classList.toggle("completed");
        mettreAJourTacheDansLocalStorage(task, taskDate, li.classList.contains("completed"));
    });

    // Bouton de suppression pour la tâche
    let deleteBtn = document.createElement("button");
    deleteBtn.textContent = "Supprimer";
    deleteBtn.className = "delete-btn";
    
    deleteBtn.addEventListener("click", function() {
        li.remove();
        supprimerTacheDuLocalStorage(task);
    });

    // Ajouter le bouton de suppression au <li>
    li.appendChild(deleteBtn);

    // Ajouter le <li> à la liste des tâches
    document.getElementById("task-list").appendChild(li);
}

// Sauvegarder une tâche dans le localStorage
function sauvegarderTacheDansLocalStorage(task, taskDate) {
    let taches;
    if (localStorage.getItem("taches") === null) {
        taches = [];
    } else {
        taches = JSON.parse(localStorage.getItem("taches"));
    }
    taches.push({ text: task, date: taskDate, completed: false });
    localStorage.setItem("taches", JSON.stringify(taches));
}

// Charger les tâches depuis le localStorage
function chargerTaches() {
    let taches;
    if (localStorage.getItem("taches") === null) {
        taches = [];
    } else {
        taches = JSON.parse(localStorage.getItem("taches"));
    }
    taches.forEach(tache => {
        creerElementTache(tache.text, tache.date, tache.completed);
    });
}

// Fonction pour afficher le tableau de bord
function afficherTableauDeBord() {
    let dashboard = document.getElementById("dashboard");
    let tbody = document.querySelector("#calendar-table tbody");

    // Vider le tableau précédent
    tbody.innerHTML = "";

    // Récupérer les tâches depuis le localStorage
    let taches = JSON.parse(localStorage.getItem("taches")) || [];

    if (taches.length === 0) {
        alert("Aucune tâche à afficher dans le tableau de bord.");
        return;
    }

    // Trier les tâches par date
    taches.sort((a, b) => new Date(a.date) - new Date(b.date));

    // Générer le tableau des tâches
    taches.forEach(tache => {
        let row = document.createElement("tr");

        // Colonne de la date
        let dateCell = document.createElement("td");
        dateCell.textContent = tache.date;

        // Colonne des tâches
        let taskCell = document.createElement("td");
        taskCell.textContent = tache.text;

        // Ajouter les cellules à la ligne
        row.appendChild(dateCell);
        row.appendChild(taskCell);

        // Ajouter la ligne au tableau
        tbody.appendChild(row);
    });

    // Afficher le tableau de bord
    dashboard.style.display = "block";
}
