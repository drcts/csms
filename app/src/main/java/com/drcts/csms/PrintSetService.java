package com.drcts.csms;

import static android.bluetooth.BluetoothDevice.BOND_BONDED;
import static android.bluetooth.BluetoothDevice.BOND_NONE;

import android.app.Service;
import android.bluetooth.BluetoothAdapter;
import android.bluetooth.BluetoothDevice;
import android.content.Intent;
import android.content.IntentFilter;
import android.os.Build;
import android.os.Handler;
import android.os.IBinder;
import android.os.Looper;
import android.util.Log;
import android.widget.Toast;

import com.drcts.csms.utils.ClsUtils;
import com.drcts.csms.utils.Preference;
import com.gengcon.www.jcprintersdk.JCAPI;
import com.gengcon.www.jcprintersdk.callback.Callback;
import com.gengcon.www.jcprintersdk.callback.PrintCallback;

public class PrintSetService extends Service {

    /**
     * B3S系列打印机打印接口 B3S시리즈 프린터인쇄 API 인스턴스
     */
    public static JCAPI mJCAPI = null;

    /**
     * 내핸드폰에 저장된 프린터장비
     */
    private String mLastConnectSuccessDeviceName;
    private String deviceAddress;

    /*
      B3S系列打印机回调接口 B3S시리즈프린터 장비 콜백인터페이스
     */
    private Callback mCallback;
    private static PrintCallback mPrintCallback;

    Handler handler = new Handler(Looper.getMainLooper());




    public PrintSetService() {

        // Preference에서 장비정보 가져오기
        mLastConnectSuccessDeviceName = Preference.getDeviceName(); //"D11-D730020454";
        deviceAddress = Preference.getDeviceAddress();              //"01:B6:EC:BE:03:09";


        /**
         * JCAPI 인스턴스 초기화콜백
         */
        mCallback = new Callback() {
            @Override
            public void onConnectSuccess(String s, int i) {
                Toast.makeText(getApplicationContext(), "연결성공", Toast.LENGTH_SHORT).show();
            }

            @Override
            public void onDisConnect() {
                Toast.makeText(getApplicationContext(), "연결이 종료되었습니다", Toast.LENGTH_SHORT).show();
            }

            @Override
            public void onElectricityChange(int i) {

            }

            @Override
            public void onCoverStatus(int i) {

            }

            @Override
            public void onPaperStatus(int i) {

            }

            @Override
            public void onHeartDisConnect() {

            }
        };


        /*
            인쇄처리 콜백인터페이스
         */
        mPrintCallback = new PrintCallback() {
            @Override
            public void onRibbonUsed(double v) {
                handler.postDelayed(new Runnable() {
                    @Override
                    public void run()
                    {
                        Toast.makeText(getApplicationContext(), "onRibbonUsed...", Toast.LENGTH_SHORT);
                    }
                }, 0);
            }

            @Override
            public void onPrintProgress(int i) {
                handler.postDelayed(new Runnable() {
                    @Override
                    public void run()
                    {
                        Toast.makeText(getApplicationContext(), "onPrintProgress...", Toast.LENGTH_SHORT);
                    }
                }, 0);
            }

            @Override
            public void onPrintPageCompleted() {
                mJCAPI.endJob();

                handler.postDelayed(new Runnable() {
                    @Override
                    public void run()
                    {
                        Toast.makeText(getApplicationContext(), "인쇄성공", Toast.LENGTH_SHORT).show();
                    }
                }, 0);
            }

            @Override
            public void onPageNumberReceivingTimeout() {
                handler.postDelayed(new Runnable() {
                    @Override
                    public void run()
                    {
                        Toast.makeText(getApplicationContext(), "onPageNumberReceivingTimeout...", Toast.LENGTH_SHORT);
                    }
                }, 0);
            }

            @Override
            public void onAbnormalResponse(final int i) {
                Log.d("CSMS", "인쇄 테스트 - 인쇄취소 - 비정상콜백: " + i); //인쇄 테스트 - 인쇄취소 - 비정상콜백
                try{
                    if (i < 8) {
                        mJCAPI.endJob();
                    }else {
                        handler.postDelayed(new Runnable() {
                            @Override
                            public void run()
                            {
                                Toast.makeText(getApplicationContext(), "인쇄 실패에 대한 예외 코드:"+i, Toast.LENGTH_SHORT).show(); //인쇄 실패에 대한 예외 코드
                            }
                        }, 0);

                    }
                }catch (Exception e){}

            }
        };

    }

    @Override
    public IBinder onBind(Intent intent) {
        // TODO: Return the communication channel to the service.
        throw new UnsupportedOperationException("Not yet implemented");
   }

    @Override
    public int onStartCommand(Intent intent, int flags, int startId) {

        /*
                new Thread(new Runnable() {
                    @Override
                    public void run() {
                    }
                }).start();
        */
        /****
         * 장비콜백인터페이스 세팅
         */
        mJCAPI = JCAPI.getInstance(mCallback);

        //저장된 장치가 없으면 서비스중지
        if( deviceAddress == null || deviceAddress == ""){
            return super.onStartCommand(intent, flags, startId);
        }


        // 프린터 연결
        checkPrinter();


        
        return START_STICKY;
    }


    @Override
    public void onDestroy() {
        super.onDestroy();
    }







    /**
     * 1.블루투스 프린터 페어링목록 검색
     * 2.내프린터 페어링이면 자동 연결
     * 3.내프린터가 없거나, 페어링되어있지 않으면 - 프린터세팅화면에서 장비선택해주어야함
     */
    public void checkPrinter(){

        // 직전연결장비의 MAC으로 장비상태 가져오기
        BluetoothDevice bluetoothDevice = BluetoothAdapter.getDefaultAdapter().getRemoteDevice(deviceAddress);
        int deviceStatus = bluetoothDevice.getBondState();
        

        // 페어링된 프린터는 바로 연결시도
        //已配对进行连接 연결하기 위해 페어링됨
        if (deviceStatus == BOND_BONDED) {

            int isOpenSuccess = mJCAPI.openPrinterByAddress(getApplication(), deviceAddress, 0);

            if (isOpenSuccess == 0) {
                Toast.makeText(getApplicationContext(), "장치연결 성공", Toast.LENGTH_SHORT).show();
            } else {
                Toast.makeText(getApplicationContext(), "장치의 전원이 켜져있는지 확인하세요", Toast.LENGTH_SHORT).show();
            }
        }
        
    }



    /**
     * 打印标签 라벨인쇄
     */
    public static void printLabel(String barcode, String comNm) {
        int itype=mJCAPI.getLabelType();
        Log.d("CSMS", "打印测试-取消打印-异常回调: itype - " + itype); //인쇄 테스트 취소 인쇄 비정상 콜백

        //프린터타입
        int ptype = mJCAPI.getPrinterType();
        //D11
        if(ptype == 512){
            mJCAPI.startJob(40, 12, 90);//B21
            mJCAPI.startPage();

            mJCAPI.drawQrCode(barcode,3,2,8,0);

            mJCAPI.drawText(barcode, 13, -6, 130, 20
                    , 3, 0.0, 1.0F, (byte) 0x01
                    , 0, 0, false, "");
            mJCAPI.drawText(comNm, 13, 0, 130, 17
                    , 2.5, 0.0, 1.0F, (byte) 0x01
                    , 0, 0, false, "");

            mJCAPI.endPage();
            mJCAPI.commitJob(1, 1, 3,  mPrintCallback);
        }
        //B21
        else if(ptype == 771){
            mJCAPI.startJob(50, 30, 0);//B21
            mJCAPI.startPage();

            mJCAPI.drawQrCode(barcode,2,7,14,0);

            mJCAPI.drawText(barcode, 17, 2, 35, 18
                    , 4, 0.0, 1.0F, (byte) 0x01
                    , 0, 0, false, "");
            mJCAPI.drawText(comNm, 17, 10, 35, 10
                    , 3, 0.0, 1.0F, (byte) 0x01
                    , 0, 0, false, "");

            mJCAPI.endPage();
            mJCAPI.commitJob(1, 1, 3,  mPrintCallback);
        }
        else{
            mJCAPI.startJob(40, 12, 90);//B21
            mJCAPI.startPage();

            mJCAPI.drawQrCode(barcode,3,2,8,0);

            mJCAPI.drawText(barcode, 13, -6, 130, 20
                    , 3, 0.0, 1.0F, (byte) 0x01
                    , 0, 0, false, "");
            mJCAPI.drawText(comNm, 13, 0, 130, 17
                    , 2.5, 0.0, 1.0F, (byte) 0x01
                    , 0, 0, false, "");

            mJCAPI.endPage();
            mJCAPI.commitJob(1, 1, 3,  mPrintCallback);
        }





    }

}