package com.drcts.csms.webcall;

import static org.apache.cordova.device.Device.TAG;

import android.content.Intent;
import android.content.pm.PackageInfo;
import android.content.pm.PackageManager;
import android.net.Uri;
import android.util.Log;
import android.widget.Toast;

import com.drcts.csms.MainActivity;
import com.drcts.csms.PrintActivity;
import com.drcts.csms.PrintSetService;
import com.gengcon.www.jcprintersdk.JCAPI;
import com.gengcon.www.jcprintersdk.callback.PrintCallback;

import org.apache.cordova.CordovaPlugin;
import org.apache.cordova.CallbackContext;

import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

/**
 * This class echoes a string called from JavaScript.
 */
public class web_call extends CordovaPlugin {

    @Override
    public boolean execute(String action, JSONArray args, CallbackContext callbackContext) throws JSONException {


        // API버전 체크
        if (action.equals("checkMethod")) {
            //apk 버전정보
            PackageInfo pi = null;
            try {
                pi = cordova.getActivity().getPackageManager().getPackageInfo(cordova.getActivity().getPackageName(), 0);
            } catch (PackageManager.NameNotFoundException e) {
                e.printStackTrace();
            }

            int _versionCode = pi.versionCode;
            String versionName = pi.versionName;
            String versionCode_app = "10000";
            try {
                versionCode_app = Integer.toString(_versionCode);
            }catch(Exception e){}


            //서버 apk배포 버전
            String versionCode = "10000";
            try{
                versionCode = (String) args.getJSONArray(0).get(0);

            }catch(Exception e){}



            if(versionCode.compareTo(versionCode_app) > 0 ){
                //apk 다운로드페이지 브라우저 오픈 & 앱종료
                Intent intent = new Intent(Intent.ACTION_VIEW, Uri.parse("http://1.221.243.162:8801/csapk.html"));
                cordova.getActivity().startActivity(intent);


                //앱종료
                try {
                    Thread.sleep(1000);
                } catch (InterruptedException e) {
                    e.printStackTrace();
                }
                cordova.getActivity().finish();
            }
            else{
                callbackContext.success("Y"); //버전체크 성공
            }


            return true;
        }




        // 프린터장비 백그라운드 서비스실행
        else if (action.equals("svcMethod")) {
            //서비스실행중이면 아무것도하지않음
            if(PrintSetService.mJCAPI != null){
                callbackContext.success("Y");
                return true;
            }


            Intent it = new Intent(cordova.getContext(), PrintSetService.class);

            try{
                cordova.getContext().stopService(it);
            }catch(Exception e){
                Log.d("CSMS","서비스 중지실패...");
            }
            //            try {
            //                Thread.sleep(3000);
            //            } catch (InterruptedException e) {
            //                e.printStackTrace();
            //            }
            try{
                cordova.getContext().startService(it);
            }catch(Exception e){
                Log.d("CSMS","서비스 중지실패...");
            }
            // 서비스를 시작했기때문에 프린터를 바로 날리지않도록 N리턴 - 출력버튼은 한번더 누르도록 유도함
            callbackContext.success("N");
            return true;
        }


        // 바코드출력
        else if (action.equals("printMethod")) {
            String barcode = "";
            String comNm = "";
            try{
                barcode = (String) args.getJSONArray(0).get(0);
                comNm = (String) args.getJSONArray(0).get(1);

            }catch(Exception e){

            }


            if(PrintSetService.mJCAPI != null && PrintSetService.mJCAPI.isConnection() == 0 ){
                // 프린터 연결됨
                PrintSetService.printLabel(barcode, comNm);
            }
            else{
                //프린터설정 페이지 안내메세지
                Toast.makeText(cordova.getContext(), "프린터가 연결되지 않았습니다.", Toast.LENGTH_LONG);
                return false;
            }

            return true;
        }

        // 프린터설정
        if (action.equals("setMethod")) {

            // Printer 페이지전환
            Intent intent = new Intent(cordova.getActivity(), PrintActivity.class);
            cordova.getActivity().startActivity(intent);

            return true;
        }


        // 앱종료
        else if (action.equals("exitMethod")) {

            cordova.getActivity().finish();
        }






        return false;
    }



}
