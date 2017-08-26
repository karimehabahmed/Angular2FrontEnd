import { Component } from '@angular/core';
import { Teacher, Course, Achievement, Game } from "../_models/index";
import { CourseService } from "../_services/index";
import { achievementService, AlertService } from "../_services/index";
import { ActivatedRoute, Router } from "@angular/router";
import { GameService } from "../_services/game.service";

@Component({
    moduleId: module.id,
    selector: 'home-page',
    templateUrl: 'homePage.html'
})

export class homePageComponent {
    constructor(private route: ActivatedRoute,
        private router: Router,
        private alertService: AlertService,
        private courseservice: CourseService,
        private gameService: GameService,
        private achsrvice :achievementService
    ) { }
    courses: Course[] = [];
    private loggedUser: any;
    id: String;
    gameurl: string;
    isStudent: boolean = false;
    isTeacher: boolean = false;
    ach:Achievement[]=[];
    game:Game;
    ngOnInit() {

        this.loggedUser = JSON.parse(localStorage.getItem("currentUser"));
        //console.log("user identity >> ", this.loggedUser.identity)
        // this.getStudentUnenrolledCoursesList()
        if (this.loggedUser.identity == "Teacher") {
            this.getTeacherCourses()
            this.isTeacher = true;
        }
        else if (this.loggedUser.identity == "Student") {
            this.getStudentAch();
            this.getStudentCourses()
            this.isStudent = true;
        }

    }
    onClick(gameName:string){
        localStorage.setItem('gameName',gameName); 
        this.router.navigate(['/game']);
        
    }
    getStudentUnenrolledCoursesList() {
        this.courseservice.showStudentUnenrolledCourses(this.loggedUser.username).subscribe(data => {
            console.log("unenrolled courses ", data)
        })
    }
    getCourseGames(listofCourses: Course[]) {
        let counter = 0;
        for (let course of listofCourses) {
            counter++;
            course.id = counter;
            course.games = []
            this.gameService.getGamesOfCourse(course.courseName).subscribe(listOfCourseGames => {
                course.games = listOfCourseGames;
            });
        }
    }
    getTeacherCourses() {
        this.courseservice.showTeacherCourses(this.loggedUser.username).subscribe(data => {
            this.courses = data;
            this.getCourseGames(this.courses)
            console.log("teacher courses >>", this.courses)
        });
    }
    getStudentCourses() {
        this.courseservice.showStudentCourses(this.loggedUser.username).subscribe(data => {
            this.courses = data;
            this.getCourseGames(this.courses)
            console.log(" student courses >>", this.courses)
        });
    }
    getStudentAch(){
        this.achsrvice.showAchievements(this.loggedUser.username).subscribe(data => {
            this.ach = data;
            console.log(" student ach>>", this.ach)
        });
    }


}
//app.component.html