package com.drcts.csms;

import static android.bluetooth.BluetoothDevice.BOND_BONDED;
import static android.bluetooth.BluetoothDevice.BOND_NONE;

import android.app.Activity;
import android.bluetooth.BluetoothAdapter;
import android.bluetooth.BluetoothDevice;
import android.content.BroadcastReceiver;
import android.content.Context;
import android.content.Intent;
import android.content.IntentFilter;
import android.os.Build;
import android.os.Bundle;
import android.support.v7.widget.LinearLayoutManager;
import android.support.v7.widget.RecyclerView;
import android.util.Log;
import android.view.View;
import android.widget.Button;
import android.widget.EditText;
import android.widget.TextView;
import android.widget.Toast;

import com.drcts.csms.adapter.DeviceAdapter;
import com.drcts.csms.bean.Device;
import com.drcts.csms.utils.ClsUtils;
import com.drcts.csms.utils.Preference;
import com.gengcon.www.jcprintersdk.JCAPI;
import com.gengcon.www.jcprintersdk.callback.Callback;
import com.gengcon.www.jcprintersdk.callback.PrintCallback;
import com.yanzhenjie.permission.Action;
import com.yanzhenjie.permission.AndPermission;
import com.yanzhenjie.permission.runtime.Permission;

import java.util.ArrayList;
import java.util.List;
import java.util.Set;

import butterknife.BindView;
import butterknife.ButterKnife;

public class PrintActivity extends Activity {

    private static final String TAG = "PrintActivity";
    /**
     * 间隙纸
     */
    private static final String GAP_GAP = "间隙纸"; //갭 페이퍼
    /**
     * 黑标纸
     */
    private static final String GAP_BLACK = "黑标纸"; //블랙 라벨 용지
    /**
     * 连续纸
     */
    private static final String GAP_NONE = "连续纸"; //연속 용지
    /**
     * 过孔纸
     */
    private static final String GAP_HOLD = "过孔纸"; //종이

    /**
     * 透明纸
     */
    private static final String GAP_TRANSPARENT = "透明纸"; //투명지
    /**
     * 设置纸张类型
     */
    private static final String GAP_DEFAULT_SELECT = "设置纸张类型"; //용지 종류 설정


    /**
     * 设置纸张出纸角度
     */
    private static final String ORIENTATION_DEFAULT_SELECT = "设置纸张出纸角度"; //용지 출구 각도 설정
    /**
     * 纸张出纸角度0
     */
    private static final String ORIENTATION_0 = "0度";
    /**
     * 纸张出纸角度90
     */
    private static final String ORIENTATION_90 = "90度";
    /**
     * 纸张出纸角度180
     */
    private static final String ORIENTATION_180 = "180度";
    /**
     * 纸张出纸角度270
     */
    private static final String ORIENTATION_270 = "270度";


    @BindView(R.id.rl_device)
    RecyclerView rlDevice;
    @BindView(R.id.btn_search)
    Button btnSearch;
    @BindView(R.id.btn_disconnect)
    Button btnDisconnect;
    @BindView(R.id.btn_print_label)
    Button btnPrintLabel;
    @BindView(R.id.btnBack)
    Button btnBack;
    @BindView(R.id.textTest)
    EditText textTest;


    /**
     * B3S系列打印机打印接口 B3S시리즈 프린터인쇄 API 인스턴스
     */
    public static JCAPI mJCAPI = null;

    private static PrintCallback mPrintCallback = null;

    private int mLastState = 0; //최근접속상태

    private String mLastConnectSuccessDeviceName = "";

    /**
     * 设备列表数据 장치 목록 데이터
     */
    private final List<Device> mDeviceList = new ArrayList<>();

    /**
     * 设备mac地址 장비맥주소
     */
    private final List<String> mDeviceAddressList = new ArrayList<>();
    /**
     * 设备列表 适配器 장비목록 어댑터
     */
    private DeviceAdapter mDeviceAdapter;
    /**
     * 蓝牙适配器 핸드폰의 블루투스 어댑터
     */
    private BluetoothAdapter mBluetoothAdapter;

    /**
        广播 브로드캐스트
        블루투스장비가 핸드폰으로 보내는 송출신호에 대한 리시버
     */
    private BroadcastReceiver mReceiver;
    /**
     * 上一次 连接成功 设备的位置 마지막으로 성공적으로 연결된 장치의 위치
     */
    private int mLastConnectSuccessItemPosition;




    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_print);
        //控件绑定 콘트롤 바인딩
        ButterKnife.bind(this);
        //        initData();
        initView();
        //初始化操作必须调用,如果打印和连接不在同一个页面，请放在application里面进行全局调用
        //초기화 작업을 호출해야 합니다. 인쇄와 연결이 같은 페이지에 있지 않은 경우 전역 호출을 위해 응용 프로그램에 배치하십시오.
        initPrint();
        initEvent();

    }


    /**
     * 初始化打印控件 인쇄관련 모듈 초기화
     */
    private void initPrint() {

        //최근 연결된디바이스 가져오기
        mLastConnectSuccessDeviceName = Preference.getDeviceName();
        

        /*
            인쇄처리 콜백인터페이스
         */
        mPrintCallback = new PrintCallback() {
            @Override
            public void onRibbonUsed(double v) {
                Toast.makeText(getApplicationContext(), "onRibbonUsed...", Toast.LENGTH_SHORT);
            }

            @Override
            public void onPrintProgress(int i) {
                Toast.makeText(getApplicationContext(), "onPrintProgress...", Toast.LENGTH_SHORT);
            }

            @Override
            public void onPrintPageCompleted() {
                mJCAPI.endJob();
                runOnUiThread(new Runnable() {
                    @Override
                    public void run() {
                        Toast.makeText(PrintActivity.this, "인쇄성공", Toast.LENGTH_SHORT).show();
                    }
                });
            }

            @Override
            public void onPageNumberReceivingTimeout() {
                Toast.makeText(getApplicationContext(), "onPageNumberReceivingTimeout...", Toast.LENGTH_SHORT);
            }

            @Override
            public void onAbnormalResponse(final int i) {
                Log.d(TAG, "인쇄 테스트 - 인쇄취소 - 비정상콜백: " + i); //인쇄 테스트 - 인쇄취소 - 비정상콜백
                if (i < 8) {
                    mJCAPI.endJob();
                }else {
                    runOnUiThread(new Runnable() {
                        @Override
                        public void run() {
                            Toast.makeText(PrintActivity.this, "인쇄 실패에 대한 예외 코드:"+i, Toast.LENGTH_SHORT).show(); //인쇄 실패에 대한 예외 코드
                        }
                    });
                }

            }
        };


        /****
         * 장비콜백인터페이스 세팅
         */
        //mJCAPI = JCAPI.getInstance(mCallback);
        mJCAPI = PrintSetService.mJCAPI; //백그라운드 서비스와 API인스턴스를 공유한다


        /**
         * 핸드폰 블루투스관리어댑터 인스턴스
         */
        mBluetoothAdapter = BluetoothAdapter.getDefaultAdapter();


        /*
          蓝牙广播 意图过滤 블루투스 브로드캐스팅 인텐트 필터링
         */
        IntentFilter mFilter = new IntentFilter(BluetoothDevice.ACTION_FOUND);

        mFilter.addAction(BluetoothDevice.ACTION_ACL_CONNECTED);

        mFilter.addAction(BluetoothDevice.ACTION_ACL_DISCONNECTED);

        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.KITKAT) {
            mFilter.addAction(BluetoothDevice.ACTION_PAIRING_REQUEST);
        }
        mReceiver = new BroadcastReceiver() {
            @Override
            public void onReceive(Context context, Intent intent) {
                //获取意图 인텐트 획득
                String action = intent.getAction();
                BluetoothDevice bluetoothDevice = intent.getParcelableExtra(BluetoothDevice.EXTRA_DEVICE);
                if (BluetoothDevice.ACTION_FOUND.equals(action)) {

                    String deviceAddress = bluetoothDevice.getAddress();
                    String name = bluetoothDevice.getName();
                    boolean isPrinterType = bluetoothDevice.getBluetoothClass().getDeviceClass() == 1664;


                    if (!mDeviceAddressList.contains(deviceAddress) && name != null && isPrinterType) {
                        mDeviceAddressList.add(deviceAddress);
                        Device device = null;
                        //显示已配对设备 기 페이링장비 표시
                        if (bluetoothDevice.getBondState() == BOND_NONE) {
                            device = new Device(bluetoothDevice.getName(), deviceAddress, BOND_BONDED);
                        } else if (bluetoothDevice.getBondState() != BOND_BONDED) {
                            device = new Device(bluetoothDevice.getName(), deviceAddress, BOND_NONE);
                        }

                        mDeviceList.add(device);
                        //刷新列表 목록업데이트
                        runOnUiThread(new Runnable() {
                            @Override
                            public void run() {
                                mDeviceAdapter.notifyDataSetChanged();
                            }
                        });
                    }


                } else if (BluetoothDevice.ACTION_PAIRING_REQUEST.equals(action)) {
                    String deviceAddress = bluetoothDevice.getAddress();
                    try {
                        //3.调用setPin方法进行配对... 변경 setPin방식 페이링진행
                        ClsUtils.setPin(bluetoothDevice.getClass(), bluetoothDevice, "0000");

                        //1.确认配对 페어링확인
                        ClsUtils.setPairingConfirmation(bluetoothDevice.getClass(), bluetoothDevice, true);

                        //2.终止有序广播 순차적 브로드캐스팅중지
                        abortBroadcast();//如果没有将广播终止，则会出现一个一闪而过的配对框。방송이 종료되지 않으면 페어링 상자가 깜박임
                        Log.i("order...", "isOrderedBroadcast:" + isOrderedBroadcast() + ",isInitialStickyBroadcast:" + isInitialStickyBroadcast());

                        for (Device device : mDeviceList) {
                            if (deviceAddress.equals((device.getDeviceAddress()))) {
                                device.setDeviceConnectStatus(12);
                            }
                        }

                        runOnUiThread(new Runnable() {
                            @Override
                            public void run() {
                                mDeviceAdapter.notifyDataSetChanged();
                                Toast.makeText(PrintActivity.this, "开始配对", Toast.LENGTH_SHORT).show(); //페어링시작..
                            }
                        });


                    } catch (Exception e) {
                        // TODO Auto-generated catch block
                        e.printStackTrace();
                    }


                }
                // row level connected ACL - 블루스트등록되었지만 활성화되지않은상태
                else if (BluetoothDevice.ACTION_ACL_CONNECTED.equals(action)) {

                    String deviceAddress = bluetoothDevice.getAddress();
                    //上一次连接状态未已配对; 최근 페어링되지않은 접속상태
                    if (mLastState == BOND_BONDED) {
                        if (mDeviceAddressList.contains(deviceAddress)) {
                            for (Device device : mDeviceList) {
                                if (device.getDeviceAddress().equals(deviceAddress)) {
                                    if (device.getDeviceStatus() == 14) { //ACL상태
                                        return;
                                    } else {
                                        device.setDeviceConnectStatus(14);
                                        runOnUiThread(new Runnable() {
                                            @Override
                                            public void run() {
                                                mDeviceAdapter.notifyDataSetChanged();
                                            }
                                        });

                                        return;

                                    }
                                }
                            }
                        }
                    }

                } 
                // ACL 상태에서 해제된 상태
                else if (BluetoothDevice.ACTION_ACL_DISCONNECTED.equals(action)) {
                    String deviceAddress = bluetoothDevice.getAddress();
                    if (mDeviceAddressList.contains(deviceAddress)) {
                        for (Device device : mDeviceList) {
                            if (device.getDeviceAddress().equals(deviceAddress)) {
                                if (device.getDeviceStatus() == BOND_BONDED) {
                                    return;
                                } else {
                                    if (bluetoothDevice.getBondState() == BOND_BONDED) {
                                        device.setDeviceConnectStatus(BOND_BONDED);
                                    } else if (bluetoothDevice.getBondState() != BOND_BONDED) {
                                        device.setDeviceConnectStatus(BOND_NONE);
                                    }
                                    runOnUiThread(new Runnable() {
                                        @Override
                                        public void run() {
                                            mDeviceAdapter.notifyDataSetChanged();
                                        }
                                    });

                                    return;

                                }
                            }
                        }
                    }
                }
            }
        };
        //注册广播 브로드캐스팅 등록
        registerReceiver(mReceiver, mFilter);


        mLastConnectSuccessItemPosition = -1;
    } //initPrint


    /**
     * 初始化view 화면레이아웃 초기화
     */
    private void initView() {

        /*
                String[] labels = {GAP_DEFAULT_SELECT, GAP_GAP, GAP_BLACK, GAP_NONE, GAP_HOLD, GAP_TRANSPARENT};
                String[] labelOrientations = {ORIENTATION_DEFAULT_SELECT, ORIENTATION_0, ORIENTATION_90, ORIENTATION_180, ORIENTATION_270};
                final ArrayAdapter<String> labelAdapter = new ArrayAdapter<>(PrintActivity.this, android.R.layout.simple_spinner_item, labels);
                labelAdapter.setDropDownViewResource(android.R.layout.simple_spinner_dropdown_item);

                final ArrayAdapter<String> labelOrientationAdapter = new ArrayAdapter<>(PrintActivity.this, android.R.layout.simple_spinner_item, labelOrientations);
                labelOrientationAdapter.setDropDownViewResource(android.R.layout.simple_spinner_dropdown_item);
        */


        LinearLayoutManager linearLayoutManager = new LinearLayoutManager(PrintActivity.this);
        rlDevice.setLayoutManager(linearLayoutManager);
        mDeviceAdapter = new DeviceAdapter(mDeviceList);
        rlDevice.setAdapter(mDeviceAdapter);
    }

    /**
     * 初始化数据
     */
    private void initData() {
        //        mPrintText = "";
        //        mLabelWidth = "";
        //        mLabelHeight = "";
        //        mFontSize = "";
        //        mTextX = "";
        //        mTextY = "";
        //        mPrintQuantity = "";
        //        mPrintLabelType = 1;
    }


    /**
     * 初始化事件 UI이벤트 초기화
     */
    private void initEvent() {
        //搜索打印机 프린터 검색
        btnSearch.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                searchBluetoothDevice();
            }
        });


        //断开打印机 프린터연결해제
        btnDisconnect.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                mJCAPI.close();
                searchBluetoothDevice();

                //mJCAPI.openPrinterByAddress(getApplication(),"C8:47:8C:2D:EE:03",BLUETOOTH_SPP_CONNECT);
                //mJCAPI.openPrinterByAddress(getApplication(),"C8:47:8C:2D:EE:03",0);
                //String aaaa=mJCAPI.getPrinterSn();
                //                int aaa=mJCAPI.isConnection();
                //                Toast.makeText(PrintActivity.this, "isConnection="+aaa, Toast.LENGTH_SHORT).show();
            }
        });

        // cs모바일로
        btnPrintLabel.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {

                Intent intent = new Intent(getApplicationContext(), MainActivity.class);
                //startActivity(intent);
                onBackPressed();
            }
        });


        //打印 인쇄
        btnBack.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                /*
                mPrintText = etPrintText.getText().toString().trim();
                mLabelWidth = etSetWidth.getText().toString().trim();
                mLabelHeight = etSetHeight.getText().toString().trim();
                mFontSize = etSetFontSize.getText().toString().trim();
                mTextX = etSetTextX.getText().toString().trim();
                mTextY = etSetTextY.getText().toString().trim();
                mPrintQuantity = etSetPrintQuantity.getText().toString().trim();

                if (mPrintText.isEmpty() || mLabelWidth.isEmpty() || mLabelHeight.isEmpty() || mFontSize.isEmpty() || mTextX.isEmpty() || mTextY.isEmpty() || mPrintQuantity.isEmpty()) {
                    Toast.makeText(PrintActivity.this, "参数未设置完", Toast.LENGTH_SHORT).show();
                } else {

                    if (Integer.parseInt(mLabelWidth) == 0 || Integer.parseInt(mLabelHeight) == 0 || Integer.parseInt(mFontSize) == 0) {
                        Toast.makeText(PrintActivity.this, "标签宽高及字号不能为0", Toast.LENGTH_SHORT).show();
                    } else {
                        printLabel();
                    }

                }
                */
                printLabel(textTest.getText().toString(), "라벨프린터");  //yskim
            }
        });

        //连接设备打印机 장치프린터 연결
        mDeviceAdapter.setOnItemClickListener(new DeviceAdapter.ItemClickListener() {
            @Override
            public void onItemClick(final int position) {
                runOnUiThread(new Runnable() {
                    @Override
                    public void run() {
                        //连接前，请终止蓝牙搜索 접속전, 블루투스검색 중지요청
                        if (mBluetoothAdapter != null && mBluetoothAdapter.isDiscovering()) {
                            mBluetoothAdapter.cancelDiscovery();
                        }

                        final Device device = mDeviceList.get(position);
                        String deviceAddress = device.getDeviceAddress();

                        BluetoothDevice bluetoothDevice = BluetoothAdapter.getDefaultAdapter().getRemoteDevice(deviceAddress);
                        int deviceStatus = device.getDeviceStatus();
                        //上一次连接时的状态 최근연결당시 상태
                        mLastState = device.getDeviceStatus();
                        //未配对 进行配对 미페어링 페이링진행
                        if (deviceStatus == BOND_NONE) {
                            try {


                                // 与设备配对 기기와 페어링
                                if (ClsUtils.createBond(bluetoothDevice.getClass(), bluetoothDevice)) {
                                    runOnUiThread(new Runnable() {
                                        @Override
                                        public void run() {
                                            Toast.makeText(PrintActivity.this, "페어링시작", Toast.LENGTH_SHORT).show();
                                        }
                                    });

                                } else {
                                    runOnUiThread(new Runnable() {
                                        @Override
                                        public void run() {
                                            Toast.makeText(PrintActivity.this, "페어링실패", Toast.LENGTH_SHORT).show();
                                        }
                                    });
                                }
                            } catch (Exception e) {
                                e.printStackTrace();
                            }
                        }

                        //已配对进行连接 연결하기 위해 페어링됨
                        if (deviceStatus == BOND_BONDED) {

                            int isOpenSuccess = mJCAPI.openPrinterByAddress(getApplication(), deviceAddress, 0);

                            if (isOpenSuccess == 0) {
                                if (mLastConnectSuccessItemPosition != -1) {
                                    mDeviceList.get(mLastConnectSuccessItemPosition).setDeviceConnectStatus(BOND_BONDED);
                                }
                                device.setDeviceConnectStatus(14); //연결됨
                                mLastConnectSuccessItemPosition = position;
                                mLastConnectSuccessDeviceName = device.getDeviceName();
                                //앱저장소에 연결된 기기저장
                                Preference.putDeviceName(device.getDeviceName());
                                Preference.putDeviceAddress(deviceAddress);

                                runOnUiThread(new Runnable() {
                                    @Override
                                    public void run() {
                                        mDeviceAdapter.notifyDataSetChanged();
                                    }
                                });
                            }
                            else{
                                Toast.makeText(getApplicationContext(), "장치의 전원이 켜져있는지 확인하세요.", Toast.LENGTH_LONG);
                            }


                        }

                    }
                });
            }
        });

        //
        //        btnUpgradeFirmware.setOnClickListener(new View.OnClickListener() {
        //            @Override
        //            public void onClick(View v) {
        //                if (mJCAPI.isConnection() == 0) {
        //
        //                    mJCAPI.setUpdateFirmwareRequest("1.13","","",);
        //                } else {
        //
        //                }
        //            }
        //        });


    }

    /*
        블루투스 디바이스 검색
     */
    private void searchBluetoothDevice() {
        //判断蓝牙是否开启 블루투스가 켜져 있는지 확인
        if (mBluetoothAdapter.isEnabled()) {
            //判断搜索权限是否开启 검색 권한이 켜져 있는지 확인
            AndPermission.with(PrintActivity.this)
                    .runtime()
                    .permission(Permission.Group.LOCATION)
                    .onGranted(new Action<List<String>>() {
                        @Override
                        public void onAction(List<String> data) {
                            mDeviceList.clear();
                            mDeviceAddressList.clear();
                            //刷新列表 목록업데이트
                            runOnUiThread(new Runnable() {
                                @Override
                                public void run() {
                                    mLastConnectSuccessItemPosition = -1;


                                    Set<BluetoothDevice> pairedDevices = mBluetoothAdapter.getBondedDevices();
                                    if (pairedDevices.size() > 0) {
                                        for (BluetoothDevice device : pairedDevices) {
                                            String deviceAddress = device.getAddress();
                                            String deviceName = device.getName();
                                            boolean isPrinterType = device.getBluetoothClass().getDeviceClass() == 1664; // JC bs3 블루투스프린터
                                            if (!mDeviceAddressList.contains(deviceAddress) && deviceName != null && isPrinterType) {
                                                mDeviceAddressList.add(deviceAddress);
                                                Device printer;
                                                if (!mLastConnectSuccessDeviceName.isEmpty() && mLastConnectSuccessDeviceName.equals(deviceName) && mJCAPI.isConnection() == 0) {
                                                    printer = new Device(device.getName(), device.getAddress(), 14); //연결된상태
                                                } else {
                                                    printer = new Device(device.getName(), device.getAddress(), BOND_BONDED);   //페어링된상태
                                                }

                                                mDeviceList.add(printer);
                                            }
                                        }
                                    }

                                    mDeviceAdapter.notifyDataSetChanged(); //리사이클뷰 목록업데이트
                                }
                            });

                            //权限获取成功,允许搜索 권한획득성공, 검색시작 - 검색완료되면 mBluetoothAdapter.getBondedDevices() 가 변경되면 runOnUiThread 트리거실행됨??
                            mBluetoothAdapter.startDiscovery();
                        }
                    })
                    .onDenied(new Action<List<String>>() {
                        @Override
                        public void onAction(List<String> data) {
                            Toast.makeText(PrintActivity.this, "请开启位置权限,用于搜索蓝牙设备", Toast.LENGTH_SHORT).show(); //블루투스 장치를 검색하려면 위치 권한을 활성화하세요.
                        }
                    })
                    .start();


        } else {
            Toast.makeText(PrintActivity.this, "请开启蓝牙", Toast.LENGTH_SHORT).show(); //블루투스를 켜주세요
        }
    }


    @Override
    protected void onResume() {
        super.onResume();
        searchBluetoothDevice();

//        etPrintText.setText(mPrintText);
//        etSetWidth.setText(mLabelWidth);
//        etSetHeight.setText(mLabelHeight);
//        etSetFontSize.setText(mFontSize);
//        etSetTextX.setText(mTextX);
//        etSetTextY.setText(mTextY);
//        etSetPrintQuantity.setText(mPrintQuantity);
    }

    @Override
    protected void onStop() {
        super.onStop();
//        mPrintText = etPrintText.getText().toString().trim();
//        mLabelWidth = etSetWidth.getText().toString().trim();
//        mLabelHeight = etSetHeight.getText().toString().trim();
//        mFontSize = etSetFontSize.getText().toString().trim();
//        mTextX = etSetTextX.getText().toString().trim();
//        mTextY = etSetTextY.getText().toString().trim();
//        mPrintQuantity = etSetPrintQuantity.getText().toString().trim();
    }

    @Override
    protected void onDestroy() {
        super.onDestroy();
        //解除广播注册 BR 등록해제
        unregisterReceiver(mReceiver);
    }

    /**
     * 打印标签 라벨인쇄
     */
    public void printLabel(String barcode, String comNm) {
        //        double width = Double.parseDouble(mLabelWidth);
        //        double height = Double.parseDouble(mLabelHeight);
        //        if (mPrintLabelType == 2) {
        //            switch (mLabelOrientation) {
        //                case 90:
        //                case 270:
        //                    width -= 5;
        //                    break;
        //                case 0:
        //                case 180:
        //                default:
        //                    height -= 5;
        //                    break;
        //            }
        //        }

        if(mJCAPI.isConnection() != 0){
            Toast.makeText(PrintActivity.this, "프린터장비간 연결상태가 아닙니다.", Toast.LENGTH_SHORT);
            return;
        }

        int itype=mJCAPI.getLabelType();
        Log.d(TAG, "打印测试-取消打印-异常回调: itype - " + itype); //인쇄 테스트 취소 인쇄 비정상 콜백
        //mJCAPI.startJob(60, 40, 0);
        mJCAPI.startJob(40, 12, 90);//yskim

        mJCAPI.startPage();

        mJCAPI.drawQrCode(barcode,2,2,8,0);

        mJCAPI.drawText(barcode, 12, -6, 130, 20
                , 3, 0.0, 1.0F, (byte) 0x01
                , 0, 0, false, "");
        mJCAPI.drawText(comNm, 12, 0, 130, 17
                , 2, 0.0, 1.0F, (byte) 0x01
                , 0, 0, false, "");


        mJCAPI.endPage();
        //mJCAPI.commitJob(1, 1, 3,  mPrintCallback);
        mJCAPI.commitJob(1, 1, 3,  mPrintCallback);




    }


}

