var defaultGeneLength = 64;
var FitnessCalc = {
	solution: new Array(defaultGeneLength),
	setSolution: function(newSolution){
		this.solution = newSolution.split("");
	},
	getFitness: function(indiv){
		var fitness = 0;
		for(var i = 0; i < indiv.size() && i < this.solution.length; i++){
			if(indiv.getGene(i) == this.solution[i]){
				fitness++;
			}
		}
		return fitness;
	},
	getMaxFitness: function(){
		return this.solution.length;
	}
};{
	//FitnessCalc.solution = "1111111111111111111111111111111111111111111111111111111111111111".split("");
	FitnessCalc.solution = "1111111111111111000000010000000101000000000000110011111111111111".split("");
}

var Algorithm = {
    uniformRate: 0.5, 
    mutationRate: 0.015,
    tournamentSize: 5,
    elitism: true,
    evolvePopulation: function(pop) {
        var newPopulation = new Population(pop.size(), false);

        // Keep our best individual
        if (this.elitism) {
            newPopulation.saveIndividual(0, pop.getFittest());
        }

        // Crossover population
        var elitismOffset;
        if (this.elitism) {
            elitismOffset = 1;
        } else {
            elitismOffset = 0;
        }
        // Loop over the population size and create new individuals with
        // crossover
        for (var i = elitismOffset; i < pop.size(); i++) {
            var indiv1 = this.tournamentSelection(pop);
            var indiv2 = this.tournamentSelection(pop);
            var newIndiv = this.crossover(indiv1, indiv2);
            newPopulation.saveIndividual(i, newIndiv);
        }

        // Mutate population
        for (var i = elitismOffset; i < newPopulation.size(); i++) {
            this.mutate(newPopulation.getIndividual(i));
        }

        return newPopulation;
    },
    crossover: function(indiv1, indiv2) {
        var newSol = new Individual();
        // Loop through genes
        for (var i = 0; i < indiv1.size(); i++) {
            // Crossover
            if (Math.random() <= this.uniformRate) {
                newSol.setGene(i, indiv1.getGene(i));
            } else {
                newSol.setGene(i, indiv2.getGene(i));
            }
        }
        return newSol;
    },
	crossover2: function(indiv1, indiv2) {
        var newSol = new Individual();
        // Loop through genes
		var spliceLoc = Math.round(Math.random()*defaultGeneLength);
		for(var i = 0; i < indiv1.size(); i++){
			if(i <= spliceLoc){
				newSol.setGene(i, indiv1.getGene(i));
			}
			else{
				newSol.setGene(i, indiv2.getGene(i));
			}
		}
        
        return newSol;
    },
    mutate: function(indiv) {
        // Loop through genes
        for (var i = 0; i < indiv.size(); i++) {
            if (Math.random() <= this.mutationRate) {
                // Create random gene
                indiv.setGene(i, Math.round(Math.random()));
            }
        }
    },
    tournamentSelection: function(pop) {
        var tournament = new Population(this.tournamentSize, false);
        // For each place in the tournament get a random individual
        for (var i = 0; i < this.tournamentSize; i++) {
            var randomId = Math.floor(Math.random() * pop.size());
            tournament.saveIndividual(i, pop.getIndividual(randomId));
        }
		//b.append(tournament.individuals);
        // Get the fittest
        var fittest = tournament.getFittest();
        return fittest;
    }
}


function Population(popSize, init){
	this.individuals = new Array(popSize);
	
	if(init){
		for(var i = 0; i < popSize; i++){
			this.individuals[i] = new Individual(defaultGeneLength);
		}	
	}
	
	this.getFittest = function(){
		var fittest = this.individuals[0];
		
		for(var i = 0; i < this.individuals.length; i++){
			//b.append(i);
			if(fittest.getFitness() <= this.individuals[i].getFitness()){
				fittest = this.individuals[i];
			}
		}
		
		return fittest;
	}
	
	this.saveIndividual = function(index, indiv){
		this.individuals[index] = indiv;
	}
	
	this.getIndividual = function(index){
		return this.individuals[index];
	}
	
	this.size = function(){
		return this.individuals.length;
	}
}


function Individual(geneLength) {
	this.gene = new Array(geneLength);
	this.fitness = 0;
	
	for(var i = 0; i < this.gene.length; i++){
		this.gene[i] = Math.round(Math.random());
	}
	
	this.getGene = function(index){
		return this.gene[index];
	}
	
	this.setGene = function(index, val){
		this.gene[index] = val;
	}
	
    this.getFitness = function() {
        if (this.fitness == 0) {
            this.fitness = FitnessCalc.getFitness(this);
        }
        return this.fitness;
    }
	
	this.toString = function() {
        return this.gene.join("");
    }
	
	this.size = function(){
		return this.gene.length;
	}
}

var init = function(limit, popLimit){
	var b = document.getElementById("log");
	b.append = function(a){this.innerHTML += "<li>"+a+"</li>";}
	b.innerHTML = "";
	this.limit = limit ? limit : 20;
	this.popLimit = popLimit ? popLimit : 50;
	this.found = true;
	b.append("Starting new simulation, with a starting population of '"+this.popLimit+"', limited at "+this.limit+" generations.")
	
	var myPop = new Population(this.popLimit, true);
	// Evolve our population until we reach an optimum solution
	var generationCount = 1;
	console.time("evolve");
	while (myPop.getFittest().getFitness() < FitnessCalc.getMaxFitness()) {
		if(generationCount == this.limit+1) {generationCount--; this.found = false; break;}
		b.append("Generation: " + generationCount + " Fittest: " + myPop.getFittest().getFitness());
		myPop = Algorithm.evolvePopulation(myPop);
		generationCount++;
	}
	var timeTaken = console.timeEnd("evolve");
	if(this.found == false){
		b.append("Limit reached!");
	}
	else{
		b.append("Solution found!");
	}
	b.append("Generation: " + generationCount);
	b.append("Genes:"+myPop.getFittest().toString());
	b.append("Target:"+FitnessCalc.solution.join(""));
	b.append("Fitness:"+myPop.getFittest().getFitness());
	b.append("Time taken:"+timeTaken);
	//b.append(myPop.getFittest());
}
