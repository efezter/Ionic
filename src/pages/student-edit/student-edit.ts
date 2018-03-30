import { Component } from '@angular/core';

import { NavController,LoadingController,ToastController } from 'ionic-angular';

import { StudentData } from '../../providers/student';

import {GlobalValues} from '../../app/global-values';

import { FileTransfer, FileUploadOptions, FileTransferObject } from '@ionic-native/file-transfer';
import { Camera, CameraOptions } from '@ionic-native/camera';


@Component({
  selector: 'student-edit',
  templateUrl: 'student-edit.html'
})
export class StudentEditPage {
  student:any; 
  // schools:any[] = []; 
  submitted = false;
fni:number = 0;
  imageURI:any;
  constructor(
    public navCtrl: NavController, 
    public studentData: StudentData,
    private readonly loadingCtrl: LoadingController,
    public toastCtrl: ToastController,
    public globalValues:GlobalValues,
    private transfer: FileTransfer,
    private camera: Camera
  ) {
    // this.getSchools();
    this.student = this.globalValues.curStudent;
    // alert(this.student.pictureUrl)
   }

   getImage() {
    const options: CameraOptions = {
      quality: 100,
      destinationType: this.camera.DestinationType.FILE_URI,
      sourceType: this.camera.PictureSourceType.PHOTOLIBRARY
    } 
  
    this.camera.getPicture(options).then((imageData) => {
      this.imageURI = imageData;
      this.uploadFile();
    }, (err) => {
      console.log(err);
      this.presentToast(err);
    });
  }

  uploadFile() {
    let loader = this.loadingCtrl.create({
      content: "Yükleniyor..."
    });
    loader.present();
    const fileTransfer: FileTransferObject = this.transfer.create();
    let token = localStorage.getItem('auth_token');
    // let filename = this.imageURI.split('/').pop();
    let options: FileUploadOptions = {
      fileKey: 'file',
      fileName: "",
      chunkedMode: false,
      mimeType: "image/jpeg",
      params:{studentId:this.student.id},
      headers: {'Authorization': `Bearer ${token}`}
    }
 
    fileTransfer.upload(this.imageURI, 'http://app.bilicra.com:85/Values/upload?studentId=' + this.student.id, options)
      .then((data) => {
       
        //
        var res = JSON.parse(data.response);

        // alert(res.error)
        if (res.error && res.error == true)
        {
          alert('1')
          this.presentToast("err:" + res.status);
        }
        else{
          
          // this.student.pictureUrl = "http://app.bilicra.com/Uploads/Pictures/Students/1.jpg";
          this.student.pictureUrl = "http://app.bilicra.com/Uploads/Pictures/Students/" + res.status + ".jpg";
          alert(this.student.pictureUrl)
        }
        
     
      loader.dismiss();
      // this.presentToast("Image uploaded successfully");
    }, (err) => {
      // alert(err.status);
      loader.dismiss(); 
      this.presentToast(err.body);
    });
  }

  presentToast(msg) {
    let toast = this.toastCtrl.create({
      message: msg,
      duration: 20000,
      position: 'bottom'
    });
  
    toast.onDidDismiss(() => {
      console.log('Dismissed toast');
    });
  
    toast.present();
  }
  // onLogin(form: NgForm) {
  //   this.submitted = true;

  //   if (form.valid) {
  //     let loading = this.loadingCtrl.create({
  //       spinner: 'bubbles',
  //       content: 'Giriş yapılıyor.'
  //     });
  
  //     loading.present();

  //     this.userData
  //       .login(this.login)
  //       .subscribe(
  //         (isLoginSuccess) => {
     
  //             if(isLoginSuccess)
  //             {
  //                 // this.navCtrl.setRoot(SchedulePage);
  //                 this.fetchUserInfo();
  //             }
  //             loading.dismiss()
  //         },
  //         err => {            
  //           loading.dismiss();
  //           this.handleError(err)
  //         });
  //   }
  // }

  // getSchools() { 
  //     this.studentData
  //       .getSchools()
  //       .subscribe(
  //         (res) => { 
  //             if(res)
  //             {
  //                  this.schools = res;
  //             }
  //         },
  //         err => {            
  //           this.handleError(err)
  //         });
  // }

  updateStudent() { 

    let loading = this.loadingCtrl.create({
      spinner: 'bubbles',
      content: 'Kaydediliyor...'
    });
    loading.present();
    this.studentData
      .updateStudent(this.student)
      .subscribe(
        (res) => { 
         loading.dismiss();
            if(res.length == 0)
            {
              const toast = this.toastCtrl.create({
                message:"Bilgiler güncellendi.",
                duration: 5000,
                position: 'bottom'
              });
          
              toast.present();
            }
            else{
              alert(res);
            }
        },
        err => {            
          loading.dismiss();
          this.handleError(err)
        });
}

  addMedicine(med:any)
  {   
    if (med.value && med.value.length > 0) {
      this.student.medicines.push({id:"0","name":med.value});
      med.value = '';
    }   
  }

  delMedicine(med:any)
  {
   this.student.medicines.splice(this.student.medicines.indexOf(med),1);
  }

  addAllergy(med:any)
  {   
    if (med.value && med.value.length > 0) {
      this.student.allergies.push({id:"0","name":med.value});
      med.value = '';
    }   
  }

  delAllergy(med:any)
  {
   this.student.allergies.splice(this.student.allergies.indexOf(med),1);
  }

  addDisease(med:any)
  {   
    if (med.value && med.value.length > 0) {
      this.student.diseases.push({id:"0","name":med.value});
      med.value = '';
    }   
  }

  delDisease(med:any)
  {
   this.student.diseases.splice(this.student.diseases.indexOf(med),1);
  }

  handleError(error: any) {
    
    let message: string;
    if (error['_body']) {
      var d = JSON.parse(error['_body']);
      message = d.error_description;
    }
    else {
      message = `Giriş başarısız: ${error.statusText}`;
    }

    const toast = this.toastCtrl.create({
      message,
      duration: 5000,
      position: 'bottom'
    });

    toast.present();
  }
}
