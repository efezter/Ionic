import { RequestOptions} from '@angular/http';
import 'rxjs/add/operator/map';
import { HttpProvider } from '../http/http';
import {Injectable} from "@angular/core";

@Injectable()
export class HomeService {
 //url: string = 'http://www.724log.com:9810/api/';
  url: string = 'http://localhost:53680/api/';

    constructor(public http: HttpProvider) {
    }

    getProductionDetails() {    
        var response = this.http.get('Values/GetProductionDetails').map(res => res.json());
        return response;
    }

    getLineChart(reqDate1 :string) {        
        var response = this.http.get('Values/GetLineChart/?reqDate=' + reqDate1).map(res => res.json());
        return response;
    }

     getPRChart(reqDate1 :string) {          
        var response = this.http.get('Values/GetPRChart/?reqDate=').map(res => res.json());
        return response;
    }

    getInventories()
    {   
        var response = this.http.get('Values/GetInventories').map(res => res.json());
        return response;
    }

    getInvChart(reqDate1 :string,invIds:any[])
    {  
        var requestoptions = new RequestOptions({
            params:{reqDate:reqDate1,invIds:invIds}
        })
        var response = this.http.get('Values/GetInvChart',requestoptions).map(res => res.json());
        return response;
    }

    saveUserPushInfo(userToken :string,pushToken :string,isIos:boolean)
    {  var response ;
        try
        {
            var requestoptions = new RequestOptions({
                params:{userToken:userToken,pushToken:pushToken,isIOS:isIos}
            });
            response = this.http.get('Values/SaveUserPushInfo',requestoptions).map(res => {alert(res.json());});
        }
        catch(err)
        {
                    alert(err);
        }
        
        return response;
    }
}