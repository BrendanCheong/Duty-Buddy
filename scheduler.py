#Do pip install ortools before you accessing the library
from ortools.sat.python import cp_model

class Person:
    def __init__(self, name, blockout, chosen): #blockout and chosen are tuples of (day, shift) that personnel has blocked out/chosen
        self.blockout = blockout
        self.chosen = chosen
        #points refer to the amount of priority the personnel should get in getting his chosen/not getting his blocked out duty
        #points is determined by how many dates the personnel has chosen to commit deducted by how many dates the personnel cannot make it for duty
        self.points = len(chosen) - len(blockout)
        self.name = name

def create_shift_requests(lst_of_people, dict_of_days):
    #lst_of_people is a list of Person objects that will be the manpower for the shifts
    #dict_of_days is a dictionary with the day as the key and a list of name of shifts as the value 
    #shift_requests is a dict of dict of dict that stores the cost of a person working a shift in a particular day
    #Cost is based on the person's points and whether they have chosen or blocked out the date
    shift_requests = {}
    for i in range(len(lst_of_people)):
        person = lst_of_people[i]
        shift_requests[i] = {}
        for k in dict_of_days:
            shift_requests[i][k] = {}
            for v in range(len(dict_of_days[k])):
                if (k, dict_of_days[k][v]) in person.blockout:
                    shift_requests[i][k][v] = -(1 + person.points)
                elif (k, dict_of_days[k][v]) in person.chosen:
                    shift_requests[i][k][v] = (1 + person.points)
                else:
                    shift_requests[i][k][v] = 0
    return shift_requests


def scheduler(lst_of_people, dict_of_days, shift_requests):
    #Note that the people and shifts have already been ordered when shift_requests was made
    #(Beacuse unfortunately the solver doesnt accept non integers so I have to use index)
    #, so ordering matters!
    num_personnel = len(lst_of_people)
    all_personnel = range(len(lst_of_people))

    model = cp_model.CpModel()

    shifts = {}
    for n in all_personnel:
        for d in dict_of_days:
            for s in range(len(dict_of_days[d])):
                shifts[(n, d, s)] = model.NewBoolVar('shift_n%id%is%i' % (n, d, s))

    #Each shift got one person
    for d in dict_of_days:
        for s in range(len(dict_of_days[d])):
            model.AddExactlyOne(shifts[(n, d, s)] for n in all_personnel)

    #Each personnel works at most one shift per day
    for n in all_personnel:
        for d in dict_of_days:
            model.AddAtMostOne(shifts[(n, d, s)] for s in range(len(dict_of_days[d])))

    #Find out how many shifts are available
    total_num_shifts = 0
    for d in dict_of_days:
        total_num_shifts += len(dict_of_days[d])

    # Try to distribute the shifts evenly
    min_shifts_per_personnel = total_num_shifts // num_personnel
    if total_num_shifts % num_personnel == 0:
        max_shifts_per_personnel = min_shifts_per_personnel
    else:
        max_shifts_per_personnel = min_shifts_per_personnel + 1
    for n in all_personnel:
        num_shifts_worked = []
        for d in dict_of_days:
            for s in range(len(dict_of_days[d])):
                num_shifts_worked.append(shifts[(n, d, s)])
        model.Add(min_shifts_per_personnel <= sum(num_shifts_worked))
        model.Add(sum(num_shifts_worked) <= max_shifts_per_personnel)

    # pylint: disable=g-complex-comprehension
    model.Maximize(
        sum(shift_requests[n][d][s] * shifts[(n, d, s)] for n in all_personnel
            for d in dict_of_days for s in range(len(dict_of_days[d]))))

    solver = cp_model.CpSolver()
    status = solver.Solve(model)

    if status == cp_model.OPTIMAL:
        print('Solution:')
        for d in dict_of_days:
            print('Day', d)
            for n in all_personnel:
                for s in range(len(dict_of_days[d])):
                    if solver.Value(shifts[(n, d, s)]) == 1:
                        if shift_requests[n][d][s] >= 1:
                            print('Personnel', lst_of_people[n].name, 'works shift', dict_of_days[d][s], '(requested).')
                        elif shift_requests[n][d][s] == 0:
                            print('Personnel', lst_of_people[n].name, 'works shift', dict_of_days[d][s],
                                  '(not requested).')
                        else:
                            print('Personnel', lst_of_people[n].name, 'works shift', dict_of_days[d][s],
                                  '(block out but no choice).')
            print()
        print(f'Number of shift requests met = {solver.ObjectiveValue()}')
    else:
        print('No optimal solution found !')

#Example
#Let's say there's 4 days that requires duty, day 1 has 2 shifts(PM Shift requires 2 manpower), day 2 has 3 shifts, day 4 has 1 shift and day 5 has 3 shifts
#If you require multiple manpower for a shift, for example, day1 PM Shift requires 2 people, you can just do 1:["AM Shift", "PM Shift", "PM Shift"]
#And there's 3 people who already have their own blackout and chosen dates
dict_of_days = {1:["AM Shift","PM Shift", "PM Shift"], 2:["AM Shift", "PM Shift", "Night Shift"], 4:["AM Shift"], 5:["AM Shift", "PM Shift", "Night Shift"]}
PersonA = Person("COA Ryan",[],[(1,"AM Shift"),(1,"PM Shift"),(2,"AM Shift"),(2,"PM Shift")])#Feel free to change the blockout/chosen shifts to check if it works
PersonB = Person("PFC(NS) Brendan", [(1,"AM Shift")],[(4,"AM Shift"),(5,"PM Shift"),(5,"Night Shift")])
PersonC = Person("REC(NS) Alvin", [(2,"AM Shift"),(2,"Night Shift")],[(1,"PM Shift"),(4,"AM Shift"),(5,"PM Shift"),(5,"Night Shift")])
lst_of_people = [PersonA, PersonB, PersonC]
#Create shift requests
shift_requests = create_shift_requests(lst_of_people, dict_of_days)
print(shift_requests)
#Solve for optimal scheduling
scheduler(lst_of_people, dict_of_days, shift_requests)
