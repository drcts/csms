/*
       Licensed to the Apache Software Foundation (ASF) under one
       or more contributor license agreements.  See the NOTICE file
       distributed with this work for additional information
       regarding copyright ownership.  The ASF licenses this file
       to you under the Apache License, Version 2.0 (the
       "License"); you may not use this file except in compliance
       with the License.  You may obtain a copy of the License at

         http://www.apache.org/licenses/LICENSE-2.0

       Unless required by applicable law or agreed to in writing,
       software distributed under the License is distributed on an
       "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
       KIND, either express or implied.  See the License for the
       specific language governing permissions and limitations
       under the License.
 */

package com.drcts.csms;

import android.app.AlertDialog;
import android.content.DialogInterface;
import android.content.Intent;
import android.content.pm.PackageInfo;
import android.content.pm.PackageManager;
import android.net.Uri;
import android.os.AsyncTask;
import android.os.Bundle;
import android.support.annotation.Nullable;
import android.util.Log;

import com.drcts.csms.utils.Preference;

import org.apache.cordova.*;
import org.jsoup.Jsoup;
import org.jsoup.nodes.Document;
import org.jsoup.nodes.Element;
import org.jsoup.select.Elements;

import java.util.regex.Pattern;

public class MainActivity extends CordovaActivity
{
    AlertDialog.Builder mDialog;
    String marketVersion;
    String verSion;


    @Override
    public void onCreate(Bundle savedInstanceState)
    {
        super.onCreate(savedInstanceState);

        // enable Cordova apps to be started in the background
        Bundle extras = getIntent().getExtras();
        if (extras != null && extras.getBoolean("cdvStartInBackground", false)) {
            moveTaskToBack(true);
        }

        // Set by <content src="index.html" /> in config.xml
        loadUrl(launchUrl);



        /**
         * 플레이스토어 버전확인

         mDialog = new AlertDialog.Builder(this);
         new getMarketVersion().execute();
         */


        /**
         * 라벨프린터 연결관리
         */
        Preference.init(getApplicationContext());

    }





    /**********************
     * 내부클래스
     */

    /// 플레이스토어 버전체크
    private class getMarketVersion extends AsyncTask<Void, Void, String> {

        @Override
        protected void onPreExecute() {
            super.onPreExecute();
        }

        @Override
        protected String doInBackground(Void... params) {

            try {
                Document doc = Jsoup
                        .connect(
                                "https://play.google.com/store/apps/details?id=com.drcts.csms" )
                        .get();
                //Elements Version = doc.select(".content");
                Elements Version = doc.select(".htlgb");

                for (Element v : Version) {
                    //                    if (v.attr("itemprop").equals("softwareVersion")) {
                    //                        marketVersion = v.text();
                    //
                    //
                    //
                    //
                    //                    }
                    if (Pattern.matches("^[0-9]{1}.[0-9]{1,2}$", v.text())) {
                        marketVersion = v.text();
                        break;
                    }
                }
                return marketVersion;
            } catch (Exception e) {
                e.printStackTrace();
            }

            return null;
        }

        @Override
        protected void onPostExecute(String result) {

            PackageInfo pi = null;
            try {
                pi = getPackageManager().getPackageInfo(getPackageName(), 0);
            } catch (PackageManager.NameNotFoundException e) {
                e.printStackTrace();
            }
            verSion = pi.versionName;
            marketVersion = result;

            float _verSion = (float) 0.0;
            float _marketVersion = (float) 0.0;
            try{
                _verSion = Float.parseFloat(verSion);
            }catch (Exception e){}
            try{
                _marketVersion = Float.parseFloat(marketVersion);
            }catch (Exception e){}
            if ( _marketVersion > _verSion ) {
                mDialog.setMessage("업데이트 후 사용해주세요.")
                        .setCancelable(true)
                        .setNegativeButton("취소", new DialogInterface.OnClickListener() {
                            @Override
                            public void onClick(DialogInterface dialog, int i) {
                                dialog.dismiss();
                            }
                        })
                        .setPositiveButton("업데이트 바로가기",
                                new DialogInterface.OnClickListener() {
                                    public void onClick(DialogInterface dialog, int id) {
                                        Intent marketLaunch = new Intent(Intent.ACTION_VIEW);
                                        marketLaunch.setData(Uri.parse("https://play.google.com/store/apps/details?id=com.drcts.csms"));
                                        startActivity(marketLaunch);
                                        finish();
                                    }
                                });
                AlertDialog alert = mDialog.create();
                alert.setTitle("버전 업데이트 안내");
                alert.show();
            }

            super.onPostExecute(result);
        }
    }






}
